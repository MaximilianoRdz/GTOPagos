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

## 🧩 Componentes de Interfaz Destacados

### 1. Tarjetas de Métricas KPI (`Stat Cards`)
- Presentan un icono dentro de un contenedor circular de color suave (`bg-emerald-500/10`, `bg-rose-500/10`), seguido del título corto y la métrica formateada como moneda local (`$#,##0.00 MXN`).

### 2. Tablas de Movimientos y Pestañas Divididas
- **Barra de Pestañas**: Permite alternar entre *Gastos* e *Ingresos* con un estilo tipo *pill toggle*.
- **Filas de Tabla**: Celdas con padding amplio (`py-3.5 px-4`), hover dinámico (`hover:bg-slate-50/50 dark:hover:bg-slate-800/50`) y badges de estado de pago con código de color.

### 3. Barras de Progreso por Categoría
- Visualizan la proporción de gastos pagados frente al total presupuestado en cada categoría mediante barras de progreso animadas (`transition-all duration-300`).

### 4. Modales de Creación y Edición
- Superposición semi-transparente de pantalla completa (`bg-black/50 backdrop-blur-sm`).
- Formulario de entrada limpio con controles estilizados de Tailwind, mensajes de error flotantes y botones de acción claros (Confirmar vs Cancelar).

---

## 📱 Responsividad y Adaptabilidad

El layout responsivo se gestiona mediante el contenedor App Shell:
- **Escritorio ($\ge 1024\text{px}$)**: Menú lateral `SidebarComponent` expandido de forma fija, Navbar superior y rejilla de 3 a 4 columnas para métricas KPI.
- **Tablets y Móviles ($< 1024\text{px}$)**: Sidebar colapsable en menú hamburguesa y rejilla de 1 a 2 columnas para tarjetas financieras.
