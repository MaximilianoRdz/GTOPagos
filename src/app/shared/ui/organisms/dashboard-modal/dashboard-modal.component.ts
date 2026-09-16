import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, LayoutDashboard, X, CheckCircle } from 'lucide-angular';
import { DashboardItem } from '../../../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-slate-800 overflow-hidden">
          <!-- HEADER -->
          <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <lucide-angular [img]="LayoutDashboard" class="w-5 h-5"></lucide-angular>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {{ dashboard ? 'Editar Dashboard' : 'Crear Dashboard' }}
                </h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ dashboard ? 'Actualiza la información del espacio' : 'Organiza tus finanzas en un nuevo espacio' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              (click)="close.emit()"
              aria-label="Cerrar modal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-5 h-5"></lucide-angular>
            </button>
          </div>

          <!-- BODY -->
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                [(ngModel)]="formData.name"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-emerald-500 transition-colors"
                placeholder="Ej. Finanzas Personales, Tarjeta BBVA, Viaje a Cancún"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                [(ngModel)]="formData.description"
                rows="3"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-emerald-500 transition-colors resize-none"
                placeholder="Describe brevemente el propósito de este dashboard"
              ></textarea>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Tipo de dashboard
              </label>
              <select
                [(ngModel)]="formData.dashboard_type"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                @for (type of dashboardTypes; track type.value) {
                  <option [value]="type.value">
                    {{ type.label }}
                  </option>
                }
              </select>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Define si este dashboard manejará gastos, ingresos o ambos.
              </p>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Límite o presupuesto mensual (opcional)
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">$</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  [(ngModel)]="formData.monthly_budget"
                  class="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm outline-none focus:border-emerald-500 transition-colors"
                  placeholder="Ej. 15000 (deja vacío para usar disponible de tu sueldo)"
                />
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                Para tarjetas de crédito, puedes ingresar tu línea de crédito. Si lo dejas vacío, se usará lo disponible de tu sueldo.
              </p>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="flex items-center justify-end gap-3 p-5 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              (click)="close.emit()"
              class="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              (click)="submit()"
              class="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <lucide-angular [img]="CheckCircle" class="w-4 h-4"></lucide-angular>
              <span>{{ dashboard ? 'Guardar cambios' : 'Crear espacio' }}</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class DashboardModalComponent implements OnChanges {
  readonly LayoutDashboard = LayoutDashboard;
  readonly X = X;
  readonly CheckCircle = CheckCircle;

  @Input() isOpen = false;
  @Input() dashboard: DashboardItem | null = null;
  @Input() dashboardTypes: { value: string; label: string }[] = [
    { value: 'EXPENSES', label: 'Solo gastos' },
    { value: 'INCOME', label: 'Solo ingresos' },
    { value: 'BOTH', label: 'Ambos' },
  ];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ name: string; description: string; monthly_budget?: number | null; dashboard_type: 'EXPENSES' | 'INCOME' | 'BOTH' }>();
  @Output() validationError = new EventEmitter<string>();

  formData = {
    name: '',
    description: '',
    monthly_budget: null as number | null,
    dashboard_type: 'EXPENSES' as 'EXPENSES' | 'INCOME' | 'BOTH',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dashboard'] || changes['isOpen']) {
      if (this.dashboard) {
        this.formData = {
          name: this.dashboard.name || '',
          description: this.dashboard.description || '',
          monthly_budget: this.dashboard.monthly_budget != null ? Number(this.dashboard.monthly_budget) : null,
          dashboard_type: this.dashboard.dashboard_type || 'EXPENSES',
        };
      } else {
        this.formData = {
          name: '',
          description: '',
          monthly_budget: null,
          dashboard_type: 'EXPENSES',
        };
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  submit(): void {
    if (!this.formData.name.trim()) {
      this.validationError.emit('El nombre del dashboard es requerido');
      return;
    }

    const budgetVal = this.formData.monthly_budget != null && !isNaN(Number(this.formData.monthly_budget)) && Number(this.formData.monthly_budget) > 0
      ? Number(this.formData.monthly_budget)
      : null;

    this.save.emit({
      name: this.formData.name.trim(),
      description: this.formData.description.trim(),
      monthly_budget: budgetVal,
      dashboard_type: this.formData.dashboard_type,
    });
  }
}
