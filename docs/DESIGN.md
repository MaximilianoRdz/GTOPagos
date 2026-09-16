# Sistema de Diseño y UI/UX - GTOPagos

Este documento especifica las pautas de diseño visual, sistema de color, tipografía, componentes de interfaz y experiencia de usuario (UX) implementados en **GTOPagos**.

---

## 🎨 Principios de Diseño Visual

1. **Estética Moderna y Premium**: Uso de bordes suaves (`rounded-xl` / `rounded-2xl`), elevación sutil con sombras refinadas (`shadow-sm`, `shadow-md`) y contrastes calibrados.
2. **Soporte de Tema Adaptable**: Experiencia coherente y visualmente impactante tanto en **Modo Claro** (Light Mode) como en **Modo Oscuro** (Dark Mode).
3. **Claridad de Información Financiera**: Jerarquía visual inmediata donde los datos numéricos cruciales (Balances, Ingresos Totales, Gastos Totales) destacan mediante tamaños de fuente destacados y colores semánticos.
4. **Interacciones Dinámicas**: Efectos *hover*, micro-animaciones en botones y barras de progreso fluidas para reflejar porcentajes de avance de forma visual.

---

## 🔤 Tipografía

El proyecto utiliza la tipografía **Outfit** de Google Fonts, configurada globalmente en `src/styles.css`:

- **Familia Tipográfica**: `'Outfit', sans-serif`
- **Pesos Utilizados**:
  - `400` (Regular): Textos descriptivos y celdas de tabla.
  - `500` (Medium): Etiquetas, botones e ítems de navegación.
  - `600` (SemiBold): Encabezados de sección y títulos de tarjeta.
  - `700` (Bold): Grandes métricas numéricas y saldos principales.

```css
/* Configuración en src/styles.css */
@import 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap';

h1, h2, h3, h4, h5, p, span, button, a, input {
  font-family: 'Outfit', sans-serif;
}
```

---

## 🎨 Paleta de Colores y Tokens Semánticos

GTOPagos utiliza los tokens de color de **TailwindCSS v4**, estructurados dinámicamente según el tema seleccionado:

| Rol de Diseño | Modo Claro (Light) | Modo Oscuro (Dark) | Uso Principal |
| :--- | :--- | :--- | :--- |
| **Fondo Principal** | `bg-slate-50` | `dark:bg-slate-950` | Lienzo de fondo de la aplicación. |
| **Fondo de Tarjeta** | `bg-white` | `dark:bg-slate-900` | Tarjetas KPI, contenedores de tablas y modales. |
| **Texto Principal** | `text-slate-900` | `dark:text-slate-100` | Títulos y saldos. |
| **Texto Secundario** | `text-slate-500` | `dark:text-slate-400` | Descripciones, fechas y subtítulos. |
| **Bordes** | `border-slate-200` | `dark:border-slate-800` | Divisores y contornos de tarjetas. |
| **Ingresos / Éxito** | `text-emerald-600` | `dark:text-emerald-400` | Balance positivo, ingresos y estado "Pagado". |
| **Gastos / Alerta** | `text-rose-600` | `dark:text-rose-400` | Gastos, montos negativos y botón "Eliminar". |
| **Pendiente / Cuotas** | `text-amber-600` | `dark:text-amber-400` | Pagos pendientes y compras a crédito. |
| **Primario / Acción** | `bg-indigo-600` | `dark:bg-indigo-500` | Botón principal "Crear Movimiento", "Guardar". |

---

## 🧩 Jerarquía y Componentes de Interfaz (Atomic Design)

La interfaz se construye bajo los principios de **Atomic Design**, separando responsabilidades visuales y funcionales en tres niveles:

### 1. Átomos (`src/app/shared/ui/atoms/`)
Componentes indivisibles con alta pureza visual:
- `BadgeComponent`: Etiquetas de estado (`paid`, `pending`, alertas) con variantes cromáticas suaves y bordes redondeados.
- `ButtonComponent`: Botones primarios, secundarios, fantasma y destructivos con estados de hover y spinner de carga integrado.
- `IconComponent`: Wrapper dinámico para la suite `lucide-angular`.
- `InputComponent` & `SelectComponent`: Entradas de formulario normalizadas con soporte para estados de error, validación y temas claro/oscuro.
- `ModalComponent`: Envoltorio base para ventanas emergentes con animación de entrada y backdrop blur.
- `SpinnerComponent`: Indicador circular de carga asíncrona.

### 2. Moléculas (`src/app/shared/ui/molecules/`)
Combinaciones cohesivas de átomos:
- `StatCardComponent`: Métrica financiera con icono estilizado, título normalizado ("Total a pagar", "Pendiente de pago", etc.) e importe con formato monetario.
- `BalanceCardComponent`: Panel destacado de balance global con degradados adaptables.
- `AdviceCardsComponent`: Consejos inteligentes basados en la salud del presupuesto, con íconos de advertencia o éxito y cierres interactivos.
- `ProgressBarComponent`: Barra de porcentaje con transiciones suaves (`duration-500`) y colores semánticos (verde para ingresos o metas, ámbar/rojo para consumo de presupuesto).
- `TabsNavComponent`: Conmutadores tipo cápsula (*pill toggle*) para alternar vistas (Gastos vs Ingresos, períodos o configuraciones).
- `SearchBarComponent`: Barra de filtrado en tiempo real con debounce y limpieza rápida.
- `EmptyStateComponent`: Ilustración y mensaje motivacional para estados vacíos de datos.

### 3. Organismos (`src/app/shared/ui/organisms/`)
Módulos completos de interacción con lógica de presentación:
- `FinancialRecordsTableComponent`: Tabla de transacciones paginada, con ordenamiento, acciones de edición/eliminación y badges de estado.
- `BudgetOverviewComponent`: Tablero concentrador de métricas clave y progreso global.
- `GoalCardComponent`: Tarjeta de meta de ahorro con porcentaje de cumplimiento, saldo faltante y fecha estimada.
- `ReportTableComponent`: Tabla estructurada para balances consolidados por categoría y tipo de movimiento.
- `RecordModalComponent` e `ImportModalComponent`: Formularios interactivos para registro manual y mapeo masivo desde Excel.

### 4. Sistema de Tours Guiados (`TourComponent`)
- **Spotlight Cutout**: Recorte SVG transparente que enfoca el elemento activo del DOM mientras oscurece el resto de la interfaz con un velo semi-transparente (`bg-black/60 backdrop-blur-xs`).
- **Tooltip Flotante**: Cuadro de diálogo anclado dinámicamente (`top`, `bottom`, `left`, `right`) con título, explicación, indicadores de progreso paso a paso y botones de control ("Anterior", "Siguiente", "Finalizar").

---

## 📱 Responsividad y Adaptabilidad

El layout responsivo se gestiona mediante el contenedor App Shell:
- **Escritorio ($\ge 1024\text{px}$)**: Menú lateral `SidebarComponent` expandido de forma fija, Navbar superior y rejilla de 3 a 4 columnas para métricas KPI.
- **Tablets y Móviles ($< 1024\text{px}$)**: Sidebar colapsable en menú hamburguesa y rejilla de 1 a 2 columnas para tarjetas financieras.

