# Memoria Técnica del Proyecto - GTOPagos

Este documento registra las decisiones de diseño técnico, el diccionario de entidades, los patrones de persistencia local y el mapa de estado actual del sistema **GTOPagos**.

---

## 💡 Decisiones de Diseño Técnico

### 1. Adopción de Componentes Standalone de Angular 21
- **Razón**: Reducir el boilerplate de `@NgModule`, optimizar el tree-shaking del bundle de producción y simplificar las pruebas unitarias.
- **Implementación**: Cada componente declara sus dependencias en `imports: [SHARED_IMPORTS, ...]`.

### 2. Estilos con TailwindCSS v4 y Google Font 'Outfit'
- **Razón**: Tailwind v4 ofrece una compilación ultrarrápida impulsada por PostCSS (`@tailwindcss/postcss`). La inclusión de la fuente 'Outfit' otorga una estética visual premium y moderna.
- **Implementación**: En `src/styles.css` se configura la regla de importación tipográfica y la variante de tema oscuro `@custom-variant dark (&:where(.dark, .dark *));`.

### 3. Arquitectura de UI con Atomic Design
- **Razón**: Favorecer la reutilización sistemática de controles y simplificar el mantenimiento visual separando la presentación básica (`atoms`) de composiciones contextuales (`molecules`) y bloques complejos de negocio (`organisms`).
- **Implementación**: Componentes organizados en `src/app/shared/ui/` bajo las carpetas `atoms/`, `molecules/` y `organisms/`.

### 4. Sistema de Tours Interactivos sin Dependencias Externas
- **Razón**: Evitar sobrecargar el bundle con librerías pesadas como Shepherd.js o Intro.js, manteniendo compatibilidad total con Angular 21 Standalone y Signals.
- **Implementación**: `TourService` computa coordenadas rectangulares vía `getBoundingClientRect()` del elemento seleccionado con atributo `id` o `class`, renderizando un overlay SVG con spotlight y tooltips flotantes en `TourComponent`.

### 5. Persistencia en `localStorage`
El estado persistente del lado del cliente se administra mediante la API `localStorage`:

| Clave | Tipo | Valor / Descripción |
| :--- | :--- | :--- |
| `access_token` | `string` | Token de acceso JWT utilizado en las cabeceras HTTP Bearer. |
| `refresh_token` | `string` | Token de refresco JWT para renovación de sesión. |
| `theme` | `'light' \| 'dark' \| 'auto'` | Preferencia visual del usuario gestionada por `ThemeService`. |
| `language` | `'es' \| 'en'` | Idioma preferido de la interfaz gestionado por `I18nService`. |
| `is_demo` | `'true' \| 'false'` | Bandera indicativa de sesión en Modo Demo / Invitado. |
| `gtopagos_tour_<module>_<id>` | `'completed'` | Bandera de tour completado por módulo específico para cada usuario. |

---

## 🗂️ Modelo de Datos y Entidades Clave

Las entidades principales del sistema están definidas en `src/app/core/services/` y `src/app/shared/models/`:

### 1. `AuthUser`
Representa al usuario autenticado en la plataforma:
```typescript
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
}
```

### 2. `DashboardItem`
Tablero de presupuesto configurado por el usuario:
```typescript
export interface DashboardItem {
  id: number;
  name: string;
  description: string;
  dashboard_type: 'EXPENSES' | 'INCOME' | 'BOTH';
  total_income: number;
  total_expense: number;
  balance: number;
  records_count: number;
}
```

### 3. `FinancialRecord`
Movimiento financiero individual (Gasto o Ingreso):
```typescript
export interface FinancialRecord {
  id: number;
  amount: string;
  description: string;
  record_date: string;
  is_recurrent: boolean;
  payment_type: 'CREDIT' | 'DEBIT';
  current_installment: number;
  total_installments: number;
  dashboard_id: number;
  record_type_id: number;
  category_id: number | null;
  category_name: string | null;
  payment_method_id: number | null;
  payment_status_id: number | null;
  financial_goal?: number | null;
}
```

### 4. `FinancialGoal`
Meta de ahorro con seguimiento de saldo objetivo y progreso:
```typescript
export interface FinancialGoal {
  id: number;
  name: string;
  target_amount: number | string;
  saved_amount: number | string;
  target_date?: string;
  created_at: string;
  updated_at?: string;
}
```

### 5. `TourStep`
Definición de cada paso del tutorial guiado interactivo:
```typescript
export interface TourStep {
  targetSelector: string;
  titleKey: string;
  contentKey: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}
```

### 6. `NotificationPreferences`
Preferencias de alertas y avisos del usuario:
```typescript
export interface NotificationPreferences {
  notification_method: 'email' | 'sms' | 'both';
  budget_alerts: boolean;
  goal_reminders: boolean;
  weekly_reports: boolean;
  monthly_reports: boolean;
  transaction_alerts: boolean;
  payment_reminders: boolean;
}
```

---

## 🧠 Algoritmos Especiales e Inteligencia de Datos

### 1. Detección Inteligente de Movimientos desde Excel (`detectFinancialRows`)
Ubicado en `dashboards.component.ts`, este algoritmo analiza las filas extraídas de un archivo `.xlsx` mediante la librería `xlsx`:
1. **Detección de Recurrencia**: Ocurrencias $\ge 6$ se marcan automáticamente como pago recurrente (`isRecurring = true`).
2. **Detección de Cuotas / Meses sin Intereses**: Ocurrencias $> 1$ y $< 6$ se clasifican como compra a plazos (`isInstallment = true`).
3. **Mapeo Automático de Categorías (`detectCategory`)**: Compara la descripción del gasto contra palabras clave registradas en el catálogo de categorías (`CategoryKeyword`) para sugerir la categoría más adecuada.

### 2. Estandarización de Nomenclatura Financiera
Para garantizar total claridad y apego a las expectativas de usabilidad contable:
- Se reemplazó el término "Debo este período" por **"Total a pagar"**: Refleja la suma neta consolidada de obligaciones del corte mensual.
- Se reemplazó el término "Falta pagar" por **"Pendiente de pago"**: Denota con precisión el remanente de movimientos aún no liquidados.

---

## ⚠️ Limitaciones Conocidas y Deuda Técnica

1. **Configuración de la API Endpoint**: Por defecto se apunta a `http://localhost:8000/api` en `environments.ts`. Debe actualizarse para entornos de homologación y producción.
2. **Filtrado Mixto en Paginación**: La carga de registros soporta paginación en backend, complementada con filtros por tipo de movimiento (`filteredRecords`) calculados reactivamente en el cliente.

---

## 🔮 Roadmap Futuro

- Integración de autenticación OAuth2 (Google Sign-In).
- Soporte para presupuestos colaborativos / multi-usuario por tablero.
- Notificaciones push nativas vía Service Worker en segundo plano.

