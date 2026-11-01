# GTOPagos (Frontend Web & PWA) 💳📊

Aplicación web moderna y progresiva (**PWA**) para la **gestión integral de finanzas personales y operativas**. Desarrollada con **Angular 21** y **Tailwind CSS v4**, instalable como aplicación nativa en cualquier dispositivo (Android, iOS, Windows, macOS) a través del navegador.

---

## 📌 ¿De qué trata el proyecto?

**GTOPagos** es un ecosistema financiero diseñado para que usuarios particulares, profesionales independientes y emprendedores tomen el control total de su economía diaria. Permite administrar de forma centralizada ingresos, gastos fijos/variables, metas de ahorro y compras a crédito o meses sin intereses (MSI), todo bajo una experiencia visual moderna, fluida y con modo oscuro profundo.

### Funcionalidades Principales

- 📊 **Tableros Financieros Dinámicos**: Organización de presupuestos y movimientos por contextos específicos (ej. *Hogar*, *Negocio*, *Proyectos personales*).
- 💳 **Control Inteligente de Crédito y Cuotas**: Distinción clara entre gastos al contado (`DEBIT`) y a plazos (`CREDIT`), con seguimiento automatizado de mensualidades restantes y fechas de corte/vencimiento.
- 💡 **Smart Insights Proactivos**: Motor de diagnósticos financieros en tiempo real (evaluación de burn rate, concentración de gastos por categoría, compromisos próximos a vencer y capacidad de ahorro).
- 📥 **Importación Inteligente de Excel (.xlsx)**: Procesamiento automatizado de estados de cuenta o registros masivos para categorizar movimientos sin fricción manual.
- 🎯 **Metas de Ahorro con Seguimiento Visual**: Metas financieras con cálculo dinámico de progreso, fechas estimadas y abonos directos.
- 📈 **Reportes y Analítica Financiera**: Resúmenes consolidados con exportación de informes en **PDF** y hojas de cálculo **Excel**.
- 🌐 **Soporte PWA (Progressive Web App)**: Instalable directamente desde Chrome, Safari o Edge con Service Worker (`sw.js`), manifiesto web (`manifest.webmanifest`), pantalla de inicio independiente y caché offline de activos.
- 🚀 **Modo Demo Interactivo**: Acceso rápido con un solo clic con datos de ejemplo para evaluar la plataforma sin registro obligatorio previo.

---

## 🎯 ¿Por qué se llevó a cabo este proyecto?

El proyecto surgió para resolver problemas y carencias recurrentes en la gestión financiera cotidiana:

1. **La trampa de las compras a meses y el descontrol crediticio**: En el día a día es común acumular compras en cuotas o a crédito (`MSI`) sin tener visibilidad del impacto real en el flujo de efectivo futuro. GTOPagos nació para hacer predecible cuánto dinero se compromete mes con mes.
2. **Cansancio y fricción del registro manual**: La mayoría de las aplicaciones financieras exigen ingresar cada gasto a mano, lo que provoca que los usuarios las abandonen. La integración de importadores masivos de Excel y flujos rápidos de registro resuelve este problema de raíz.
3. **Falta de herramientas adaptadas al uso diario personal**: Muchas soluciones comerciales son o muy complejas o están saturadas de publicidad y suscripciones costosas. GTOPagos se construyó como una herramienta propia, de alta velocidad, privada y sin costos ocultos.
4. **Universalidad como PWA**: Evitar tiendas de aplicaciones y configuraciones nativas pesadas; una sola URL accesible e instalable en segundos desde cualquier celular o computadora manteniendo la apariencia y comodidad de una app independiente.

---

## 🛠️ Stack Tecnológico

- **Framework**: Angular 21 (Componentes Standalone con Signals).
- **Estilos**: Tailwind CSS v4 (`@tailwindcss/postcss`) + Tipografía ['Outfit'](https://fonts.google.com/specimen/Outfit).
- **Iconografía**: [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular).
- **Procesamiento de Archivos**: SheetJS / XLSX (`xlsx`).
- **Visualización de Datos**: Chart.js (`ng2-charts`).
- **PWA & Offline**: Web App Manifest (`manifest.webmanifest`) + Service Worker (`sw.js`).
- **Estado Reactivo**: Angular Signals (`signal()`, `computed()`) + RxJS.

---

## 🚀 Inicio Rápido (Desarrollo Local)

### Requisitos Previos
- Node.js (versión 20+ recomendada)
- npm

### Instalación y Ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/MaximilianoRdz/GTOPagos.git
cd GTOPagos

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local de Angular
npm start
```

La aplicación estará disponible en `http://localhost:4200/`.

---

## 📲 Instalación como PWA en tu Dispositivo

1. Abre la aplicación en tu navegador móvil (**Chrome** en Android o **Safari** en iOS).
2. Presiona el menú del navegador:
   - **En Android (Chrome)**: Toca los 3 puntos y selecciona **"Instalar aplicación"** o **"Agregar a pantalla principal"**.
   - **En iOS (Safari)**: Toca el botón de Compartir y selecciona **"Agregar al inicio"**.
3. La aplicación se abrirá a pantalla completa sin barra de navegación del navegador, comportándose como una aplicación nativa.

---

## 📂 Scripts Disponibles en `package.json`

| Comando | Descripción |
| :--- | :--- |
| `npm start` | Inicia el servidor de desarrollo (`ng serve`). |
| `npm run build` | Compila la aplicación optimizada para producción en `dist/gtopagos`. |
| `npm run watch` | Compila en modo observación para desarrollo. |
| `npm test` | Ejecuta pruebas unitarias con Karma & Jasmine. |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
