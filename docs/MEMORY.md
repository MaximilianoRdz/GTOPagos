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

### 3. Persistencia en `localStorage`
El estado persistente del lado del cliente se administra exclusivamente mediante la API `localStorage`:

| Clave | Tipo | Valor / Descripción |
| :--- | :--- | :--- |
| `access_token` | `string` | Token de acceso JWT utilizado en las cabeceras HTTP Bearer. |
| `refresh_token` | `string` | Token de refresco JWT para renovación de sesión. |
| `theme` | `'light' \| 'dark' \| 'auto'` | Preferencia visual del usuario gestionada por `ThemeService`. |
| `language` | `'es' \| 'en'` | Idioma preferido de la interfaz gestionado por `I18nService`. |

---

## 🗂️ Modelo de Datos y Entidades Clave

Las entidades principales del sistema están definidas en `src/app/core/services/dashboard/dashboard.service.ts` y `src/app/core/services/auth/auth.service.ts`:

### 1. `AuthUser`
Representa al usuario autenticado en la plataforma:
```typescript
export interface AuthUser {
  id: number;
  name: string;
  email: string;
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
}
```

### 4. `Category` y `PaymentStatus`
```typescript
export interface Category {
  id: number;
  name: string;
  record_type_id: number;
}

export interface PaymentStatus {
  id: number;
  status: string;
  code: string;  // e.g. 'paid', 'pending'
  color: string;
}
```

---

## 🧠 Algoritmos Especiales e Inteligencia de Datos

### Detección Inteligente de Movimientos desde Excel (`detectFinancialRows`)
Ubicado en `dashboards.component.ts`, este algoritmo analiza las filas extraídas de un archivo `.xlsx` mediante la librería `xlsx`:
1. **Detección de Recurrencia**: Ocurrencias $\ge 6$ se marcan automáticamente como pago recurrente (`isRecurring = true`).
2. **Detección de Cuotas / Meses sin Intereses**: Ocurrencias $> 1$ y $< 6$ se clasifican como compra a plazos (`isInstallment = true`).
3. **Mapeo Automático de Categorías (`detectCategory`)**: Compara la descripción del gasto contra palabras clave registradas en la lista de categorías del sistema para sugerir la categoría más adecuada.

---

## ⚠️ Limitaciones Conocidas y Deuda Técnica

1. **Configuración de la API Endpoint**: Por defecto se apunta a `http://localhost:8000/api` en `environments.ts`. Debe actualizarse para entornos de homologación y producción.
2. **Manejo de Errores en Paginación**: La carga de registros actualmente soporta paginación simple de la API backend (`RecordsResponse`), pero el filtrado por pestaña de gastos e ingresos se realiza en memoria en el frontend (`filteredRecords`).

---

## 🔮 Roadmap Futuro

- Implementación de Cache Offline y Progressive Web App (PWA).
- Gráficas estadísticas con Chart.js o ApexCharts.
- Soporte para múltiples divisas (`currency_id`).
