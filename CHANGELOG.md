# Changelog - GTOPagos

Todos los cambios notables en este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/), y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [Unreleased]

### Planned
- Exportación en formato PDF de reportes consolidados por período.
- Gráficas avanzadas e interactivas para análisis de tendencias financieras.
- Integración de autenticación OAuth2 (Google Sign-In).

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
