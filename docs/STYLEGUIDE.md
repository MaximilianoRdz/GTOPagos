# Guía de Estilo de Código y Estándares - GTOPagos

Este documento establece las convenciones de desarrollo, estándares de código TypeScript/Angular 21 y buenas prácticas para mantener la calidad y consistencia del repositorio **GTOPagos**.

---

## 📏 Convenciones de Nombrado

### 1. Archivos y Directorios
Utiliza siempre **kebab-case** para los nombres de archivos y carpetas:
- **Componentes**: `budget.component.ts`, `budget.component.html`, `budget.component.css`
- **Servicios**: `dashboard.service.ts`, `auth.service.ts`
- **Guards e Interceptors**: `auth.guard.ts`, `auth.interceptor.ts`

### 2. Clases y Tipos
Utiliza **PascalCase**:
- Clases de Componentes: `BudgetComponent`, `DashboardsComponent`
- Servicios: `DashboardService`, `ThemeService`
- Interfaces y Types: `FinancialRecord`, `DashboardItem`, `AuthUser`, `Theme`

### 3. Métodos y Propiedades
Utiliza **camelCase**:
- Métodos: `loadDashboard()`, `createRecord()`, `switchTab()`
- Propiedades: `selectedDashboardId`, `isExpenses`, `showCreateModal`

### 4. Constantes Globales
Utiliza **UPPER_SNAKE_CASE**:
- Constantes de importación: `SHARED_IMPORTS`
- Diccionarios de traducción: `TRANSLATIONS`

---

## 🅰️ Estándares Angular 21 & TypeScript

### 1. Componentes Standalone (`standalone: true`)
Todos los componentes creados en el proyecto deben definirse como **Standalone**:

```typescript
import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.config';

@Component({
  selector: 'app-mi-componente',
  standalone: true,
  imports: [SHARED_IMPORTS],
  templateUrl: './mi-componente.component.html',
  styleUrl: './mi-componente.component.css',
})
export class MiComponenteComponent implements OnInit {
  // Lógica del componente
}
```

### 2. Uso de Angular Signals para Estado Local/Global
Prefiere **Angular Signals** (`signal()`, `computed()`) para variables de estado que requieran reactividad síncrona en las vistas:

```typescript
// Declaración de signal privado y versión de solo lectura
private readonly _lang = signal<Lang>('es');
readonly lang = this._lang.asReadonly();

// Propiedad derivada con computed
readonly t = computed(() => TRANSLATIONS[this._lang()]);
```

### 3. Manejo de Peticiones HTTP con RxJS
- Concentra las llamadas a APIs en los servicios ubicados en `src/app/core/services/`.
- Utiliza operadores de RxJS como `pipe`, `tap` y `finalize` para controlar estados de carga y efectos secundarios de forma limpia:

```typescript
this.creatingRecord = true;

this.dashboardService
  .createRecord(payload)
  .pipe(
    finalize(() => {
      this.creatingRecord = false;
    })
  )
  .subscribe({
    next: () => {
      this.closeCreateModal();
      this.alert.show('Movimiento creado correctamente', 'success');
    },
    error: (err) => {
      this.alert.show('Error al crear movimiento', 'error');
    },
  });
```

---

## 🎨 Convenciones de HTML y TailwindCSS 4

1. **Uso de Clases Utilitarias**: Prioriza las clases de TailwindCSS v4 directamente en los archivos `.html` frente a reglas de CSS tradicional.
2. **Soporte para Modo Oscuro**: Incluye la variante `dark:` en elementos que requieran ajuste de color para la interfaz en tema oscuro:
   ```html
   <div class="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
     <!-- Contenido -->
   </div>
   ```
3. **Tipografía Global**: La clase base del sistema utiliza la fuente `Outfit`. No fuerces fuentes secundarias salvo casos de diseño justificados.

---

## 🧱 Orden de Importaciones (Imports Order)

Mantén las importaciones de cada archivo TypeScript ordenadas en bloques bien diferenciados:

```typescript
// 1. Angular Core y Framework
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// 2. Librerías de terceros (RxJS, Lucide, XLSX, etc.)
import { finalize } from 'rxjs';
import { Plus, Trash, Pencil } from 'lucide-angular';

// 3. Core, Servicios y Guards propios
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { AlertsService } from '../../core/services/alerts/Alerts.service';

// 4. Módulos compartidos e Interfaces
import { SHARED_IMPORTS } from '../../shared/shared.config';
```
