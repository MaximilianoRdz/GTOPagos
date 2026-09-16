# Changelog - GTOPagos

Todos los cambios notables en este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Planned
- Integración de autenticación OAuth2 (Google Sign-In).
- Soporte para presupuestos compartidos y multi-usuario por tablero.
- Notificaciones push en tiempo real a través del Service Worker.

---

## [0.2.0] - 2026-09-16

### Added
- **Sistema de Tours Guiados Interactivos**:
  - `TourService` y `TourComponent` integrados en la aplicación con efectos de spotlight, sombreado de fondo (backdrop) y tooltips paso a paso.
  - Cobertura completa de tours interactivos para los módulos principales: Tablero General, Detalle de Presupuesto, Metas Financieras, Reportes y Configuración.
  - Persistencia del estado de finalización y control por usuario en `localStorage` (`gtopagos_tour_*`).
- **Modo Demo / Acceso para Invitados**:
  - Ruta pública `/demo` y componente `DemoComponent` que permite ingresar al sistema con datos de demostración preconfigurados sin necesidad de registrarse.
  - Tarjeta de acceso demo destacada en las vistas de inicio de sesión y registro.
  - Generación dinámica de datos simulados en backend para garantizar una experiencia completa a evaluadores y visitantes.
- **Arquitectura de Componentes Atómicos (Atomic Design)**:
  - Estructuración modular en la capa compartida (`src/app/shared/ui/`):
    - **Átomos**: `BadgeComponent`, `ButtonComponent`, `IconComponent`, `InputComponent`, `KpiCardComponent`, `ModalComponent`, `SelectComponent`, `SpinnerComponent`, `ToastComponent`.
    - **Moléculas**: `AdviceCardsComponent`, `BalanceCardComponent`, `ChartCardComponent`, `DashboardCardComponent`, `EmptyStateComponent`, `FormFieldComponent`, `PaginationComponent`, `ProgressBarComponent`, `SearchBarComponent`, `StatCardComponent`, `TabsNavComponent`.
    - **Organismos**: `BudgetOverviewComponent`, `CategoryProgressListComponent`, `FinancialRecordsTableComponent`, `ImportPreviewModalComponent`, `RecordFormModalComponent`, `GoalCardComponent`, `ReportTableComponent`.
- **Módulo de Metas Financieras (`goals`)**:
  - Vista dedicada (`GoalsComponent`) para definir y supervisar metas de ahorro.
  - Indicadores de monto objetivo, monto acumulado, fecha límite estimada y porcentaje de avance en tiempo real.
  - Vinculación con movimientos financieros individuales.
- **Módulo de Reportes y Analítica (`reports`)**:
  - Vista consolidada (`ReportsComponent`) con filtros por períodos mensuales y anuales.
  - Desglose analítico de ingresos y gastos, balances netos y proyecciones.
  - Exportación de reportes a formatos **PDF** y **Excel** (`.xlsx`).
- **Panel de Configuración Modular (`configuration`)**:
  - Arquitectura por pestañas: Perfil de usuario, Preferencias de notificaciones (alertas de presupuesto, recordatorios de pago y metas), Apariencia visual (tema) y Selección de idioma.
- **Progressive Web App (PWA) & Despliegue**:
  - Manifiesto de aplicación web (`manifest.webmanifest`) y Service Worker (`sw.js`).
  - Metadatos PWA y configuración en `index.html` para habilitar instalación en dispositivos móviles y de escritorio.
  - `Dockerfile` para empaquetado y distribución en contenedores.

### Changed
- **Refactorización de Nomenclatura Financiera**:
  - Actualización de títulos en tarjetas de métricas del presupuesto: "Debo este período" ahora es **"Total a pagar"** y "Falta pagar" ahora es **"Pendiente de pago"**.
- **Auditoría Ortográfica y Gramatical Integral**:
  - Corrección de más de 600 cadenas de texto en español en todos los módulos, componentes y servicios:
    - Inserción correcta de tildes (`período`, `ícono`, `gráfica`, `categoría`, `límite`, etc.).
    - Incorporación de signos de interrogación de apertura (`¿?`) en preguntas y confirmaciones modales.
    - Estandarización de mayúsculas según las normas del español (sentence case en títulos y botones: "Iniciar sesión", "Crear cuenta", "Guardar cambios").
    - Corrección de concordancia gramatical ("sea alcanzable").
- Limpieza de elementos visuales en el `SidebarComponent`, removiendo el botón manual de tour guiado para priorizar la ejecución contextual automática por módulo.

---

## [0.1.0] - 2026-07-25

### Added
- **Módulo de Autenticación**:
  - Pantallas de inicio de sesión (`login.component`), registro de usuario (`register.component`) y recuperación de contraseña (`forgot-password.component`).
  - `AuthService` para gestión de sesión y estado reactivo con Signals.
  - `AuthGuard` para protección de rutas privadas.
  - `AuthInterceptor` para inyección de encabezado `Authorization: Bearer <token>`.
- **Módulo de Presupuestos y Dashboards**:
  - `DashboardsComponent` para crear, editar, listar y eliminar tableros financieros (`EXPENSES`, `INCOME`, `BOTH`).
  - `BudgetComponent` con vistas divididas de Gastos e Ingresos, balances acumulados e historial paginado de movimientos.
  - CRUD de registros financieros con soporte para pago al contado (`DEBIT`) o crédito (`CREDIT`) a meses/cuotas.
  - Asignación de categorías financieras y estados de pago (`PAGADO`, `PENDIENTE`).
- **Importador Inteligente de Excel (`xlsx`)**:
  - Funcionalidad en `DashboardsComponent` para cargar archivos de estado de cuenta en formato Excel.
  - Detección automática de montos, recurrencias, número de parcialidades y sugerencia de categorías mediante palabras clave.
  - Modal interactivo de vista previa y mapeo masivo hacia tableros seleccionados.
- **Sistema de UI/UX y Temas**:
  - Soporte nativo para **Modo Oscuro**, Modo Claro y Detección Automática de Preferencia de Sistema a través de `ThemeService`.
  - Tipografía global `Outfit` integrada mediante `@import` en `styles.css`.
  - Iconografía moderna usando la librería `lucide-angular`.
  - Sistema de notificaciones toast dinámicas con `AlertsService` y `AlertsComponent`.
- **Internacionalización (i18n)**:
  - `I18nService` reactivo con soporte para idioma Español (`es`) e Inglés (`en`).
  - Persistencia de preferencia de idioma en `localStorage`.
- **Arquitectura Base**:
  - Configuración e inicialización de proyecto Angular 21 (Angular CLI 19.2) con componentes Standalone.
  - Integración de TailwindCSS v4 con `@tailwindcss/postcss`.
