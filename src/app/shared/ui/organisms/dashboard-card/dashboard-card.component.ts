import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Pencil, Trash2 } from 'lucide-angular';
import { DashboardItem } from '../../../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full',
  },
  template: `
    <div
      (click)="select.emit(dashboard.id)"
      class="relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-white/50 dark:border-slate-800 w-full h-full flex flex-col justify-between"
    >
      <!-- Top Content -->
      <div class="flex-1 flex flex-col">
        <!-- ACTIONS -->
        <div class="absolute top-4 right-4 flex items-center gap-2 z-10">
          <!-- EDIT -->
          <button
            type="button"
            (click)="edit.emit(dashboard); $event.stopPropagation()"
            aria-label="Editar espacio"
            title="Editar espacio"
            class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <lucide-angular [img]="Pencil" class="w-4 h-4 text-slate-600 dark:text-slate-300"></lucide-angular>
          </button>

          <!-- DELETE -->
          <button
            type="button"
            (click)="delete.emit(dashboard); $event.stopPropagation()"
            aria-label="Eliminar espacio"
            title="Eliminar espacio"
            class="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition cursor-pointer"
          >
            <lucide-angular [img]="Trash2" class="w-4 h-4 text-red-500"></lucide-angular>
          </button>
        </div>

        <!-- TITLE & TYPE BADGE -->
        <div class="pr-20 mb-3 min-h-[3.25rem]">
          <div class="flex items-start justify-between gap-2">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
              {{ dashboard.name }}
            </h2>

            <span
              class="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap mt-0.5"
              [ngClass]="{
                'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300': dashboard.dashboard_type === 'EXPENSES',
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300': dashboard.dashboard_type === 'INCOME',
                'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300': dashboard.dashboard_type === 'BOTH'
              }"
            >
              {{
                dashboard.dashboard_type === 'EXPENSES'
                  ? 'Solo gastos'
                  : dashboard.dashboard_type === 'INCOME'
                  ? 'Solo ingresos'
                  : 'Ambos'
              }}
            </span>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <p class="text-gray-500 dark:text-gray-400 mb-6 text-sm line-clamp-2 flex-1 min-h-[2.5rem]">
          {{ dashboard.description || 'Sin descripción' }}
        </p>
      </div>

      <!-- METRICS (Pinned to bottom) -->
      <div class="space-y-2 text-sm pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
        @if (hasMonthlyBudget(dashboard.monthly_budget)) {
          <div class="flex justify-between text-xs pb-1.5 mb-0.5 border-b border-slate-100 dark:border-slate-800">
            <span class="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Límite / Presupuesto
            </span>
            <span class="text-indigo-600 dark:text-indigo-400 font-bold">
              {{ formatCurrency(dashboard.monthly_budget) }}
            </span>
          </div>
        }

        @if (dashboard.dashboard_type === 'INCOME' || dashboard.dashboard_type === 'BOTH') {
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-slate-400">Ingresos</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-semibold">
              {{ formatCurrency(dashboard.total_income) }}
            </span>
          </div>
        }

        @if (dashboard.dashboard_type === 'EXPENSES' || dashboard.dashboard_type === 'BOTH') {
          <div class="flex justify-between">
            <span class="text-slate-500 dark:text-slate-400">Gastos</span>
            <span class="text-slate-700 dark:text-slate-300 font-semibold">
              {{ formatCurrency(dashboard.total_expense) }}
            </span>
          </div>
        }

        @if (dashboard.dashboard_type === 'BOTH') {
          <div class="flex justify-between font-bold pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Balance</span>
            <span [ngClass]="dashboard.balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'">
              {{ formatCurrency(dashboard.balance) }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardCardComponent {
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;

  @Input({ required: true }) dashboard!: DashboardItem;

  @Output() select = new EventEmitter<number>();
  @Output() edit = new EventEmitter<DashboardItem>();
  @Output() delete = new EventEmitter<DashboardItem>();

  hasMonthlyBudget(budget: number | string | null | undefined): boolean {
    return budget != null && Number(budget) > 0;
  }

  formatCurrency(amount: number | string | null | undefined): string {
    const val = Number(amount || 0);
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(val);
  }
}
