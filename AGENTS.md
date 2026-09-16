# Guía para Agentes de IA - GTOPagos

Bienvenido al proyecto **GTOPagos**. Este documento sirve como manual de referencia y directivas operativas para agentes de Inteligencia Artificial (y desarrolladores) que contribuyan o modifiquen la base de código de este proyecto.

---

## 📌 Descripción General del Proyecto

**GTOPagos** es una aplicación web moderna de gestión financiera personal y empresarial desarrollada en **Angular 21**. Permite a los usuarios administrar sus presupuestos, controlar ingresos y gastos, gestionar compras a crédito/contado y cuotas (meses sin intereses), importar transacciones desde archivos de Excel (`.xlsx`) con categorización inteligente, y visualizar balances financieros en tiempo real con soporte multiidioma y modo oscuro.

---

## 🛠️ Stack Tecnológico

- **Framework**: Angular 21.0 (Angular CLI 19.2) - Componentes Standalone (`standalone: true`).
- **Lenguaje**: TypeScript 5.9.
- **Estilos & UI**: TailwindCSS v4 (`@tailwindcss/postcss`) + Tipografía Google Font ['Outfit'](https://fonts.google.com/specimen/Outfit).
- **Iconografía**: [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular) (`lucide-angular`).
- **Estado Dinámico**: Angular Signals (`signal()`, `computed()`) + RxJS (`Observable`, `Subject`, `tap`, `finalize`).
- **Procesamiento de Archivos**: SheetJS / XLSX (`xlsx`).
- **Internacionalización**: Servicio i18n nativo (`I18nService`) con soporte para Español (`es`) e Inglés (`en`).
- **Backend API**: REST API accesible vía HTTP (Entorno por defecto: `http://localhost:8000/api`).

---

## 🚀 Comandos Disponibles

Ejecuta los siguientes comandos desde la raíz del proyecto:

```bash
# Iniciar servidor de desarrollo en http://localhost:4200/
npm start

# Compilar proyecto para producción
npm run build

# Compilar en modo observación (watch mode)
npm run watch

# Ejecutar pruebas unitarias con Karma & Jasmine
npm test
```

---

## 📁 Estructura del Repositorio

La arquitectura sigue una organización modular por capas basada en buenas prácticas de Angular:

```text
GTOPagos/
├── .angular/
├── docs/                        # Documentación detallada del proyecto
│   ├── ARCHITECTURE.md
│   ├── DESIGN.md
│   ├── MEMORY.md
│   ├── PRODUCT.md
│   └── STYLEGUIDE.md
├── src/
│   ├── app/
│   │   ├── core/                # Servicios singleton, interceptores, guards e i18n
│   │   │   ├── guards/          # AuthGuard
│   │   │   ├── i18n/            # I18nService y diccionario translations.ts
│   │   │   ├── interceptors/    # AuthInterceptor (JWT Bearer Token)
│   │   │   └── services/        # AuthService, DashboardService, ThemeService, AlertsService, etc.
│   │   ├── layout/              # Shell principal de la aplicación (Sidebar + Navbar + Content Outlet)
│   │   ├── modules/             # Módulos de funcionalidad (Lazy routes)
│   │   │   ├── auth/            # Login, Registro
│   │   │   ├── budget/          # Dashboards de presupuestos y gestión detallada de movimientos
│   │   │   ├── configuration/   # Configuración de usuario, tema e i18n
│   │   │   ├── dashboard/       # Vista general de resumen
│   │   │   └── forgot-password/ # Recuperación de contraseña
│   │   ├── shared/              # Reutilizables (UI, Modelos, Configuración compartida)
│   │   │   ├── ui/              # Navbar, Sidebar, Toast Alerts
│   │   │   └── shared.config.ts # SHARED_IMPORTS común
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/            # Variables de entorno (apiUrl)
│   ├── index.html
│   ├── main.ts
│   └── styles.css               # Estilos globales y configuración de TailwindCSS 4
├── angular.json
├── package.json
├── tsconfig.json
├── AGENTS.md                    # Este archivo
└── CHANGELOG.md                 # Registro de cambios
```

---

## 📐 Directivas y Reglas para Agentes de IA

Cuando trabajes en este código, debes respetar las siguientes reglas:

1. **Uso de Componentes Standalone**: Todos los componentes deben ser `standalone: true`. No crees `@NgModule` tradicionales salvo extrema necesidad.
2. **Reutilización de `SHARED_IMPORTS`**: Al crear o modificar componentes visuales, importa `SHARED_IMPORTS` desde `src/app/shared/shared.config.ts` para mantener consistencia en módulos comunes (CommonModule, ReactiveFormsModule, FormsModule, LucideIconModule, etc.).
3. **Manejo del Estado**:
   - Utiliza **Angular Signals** (`signal()`, `computed()`) para estados reactivos en componentes y servicios globales (por ejemplo `AuthService.user`, `I18nService.lang`).
   - Usa **RxJS** para llamadas HTTP asíncronas con el cliente `HttpClient`.
4. **Manejo de Estilos**:
   - Utiliza TailwindCSS 4 en lugar de escribir CSS manual siempre que sea posible.
   - Aplica variantes para Modo Oscuro mediante la clase `.dark` gestionada por `ThemeService`.
   - Mención especial a las fuentes: la tipografía por defecto es `'Outfit', sans-serif`.
5. **Inyección de Servicios & HTTP**:
   - Concentra las llamadas a API en `src/app/core/services/`. No realices peticiones `HttpClient` directas desde componentes.
   - Los tokens de autenticación se adjuntan automáticamente mediante `AuthInterceptor` desde `localStorage.getItem('access_token')`.
6. **Notificaciones al Usuario**:
   - Utiliza `AlertsService` (`src/app/core/services/alerts/Alerts.service.ts`) para mostrar toats o alertas informativas, de éxito o error al usuario.
