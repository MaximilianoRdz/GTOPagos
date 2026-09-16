import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, CheckCircle, Loader2 } from 'lucide-angular';
import { DashboardItem } from '../../../../core/services/dashboard/dashboard.service';

export interface ImportedTransactionItem {
  description: string;
  amount: number;
  record_date: string;
  behavior: 'INCOME' | 'EXPENSE';
  category_name?: string;
  category_id?: number | null;
  is_installment?: boolean;
  current_installment?: number;
  total_installments?: number;
  is_recurrent?: boolean;
  occurrences?: number;
  is_duplicate?: boolean;
  selected?: boolean;
  dashboardId?: number | null;
  [key: string]: any;
}

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="w-full max-w-5xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
          
          <!-- HEADER -->
          <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div>
              <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Movimientos detectados
              </h2>
              <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Revisa los movimientos encontrados antes de importarlos
              </p>
            </div>

            <button
              type="button"
              (click)="close.emit()"
              aria-label="Cerrar modal"
              class="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-5 h-5"></lucide-angular>
            </button>
          </div>

          <!-- ASIGNACIÓN MASIVA -->
          <div class="bg-slate-100 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 items-center justify-between shrink-0">
            <div class="text-sm font-semibold text-slate-700 dark:text-slate-300">Asignación rápida:</div>
            <div class="flex gap-4 flex-wrap">
              @if (hasExpenses()) {
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-500">Gastos a:</span>
                  <select
                    [(ngModel)]="bulkExpenseDashboardId"
                    class="text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option [value]="null">Selecciona...</option>
                    @for (d of expenseDashboardsList; track d.id) {
                      <option [value]="d.id">{{ d.name }}</option>
                    }
                  </select>
                  <button
                    type="button"
                    (click)="applyBulkAssign('EXPENSE')"
                    [disabled]="!bulkExpenseDashboardId"
                    class="text-xs px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg disabled:opacity-50 transition cursor-pointer font-medium"
                  >
                    Aplicar
                  </button>
                </div>
              }

              @if (hasIncomes()) {
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-500">Ingresos a:</span>
                  <select
                    [(ngModel)]="bulkIncomeDashboardId"
                    class="text-sm px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  >
                    <option [value]="null">Selecciona...</option>
                    @for (d of incomeDashboardsList; track d.id) {
                      <option [value]="d.id">{{ d.name }}</option>
                    }
                  </select>
                  <button
                    type="button"
                    (click)="applyBulkAssign('INCOME')"
                    [disabled]="!bulkIncomeDashboardId"
                    class="text-xs px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg disabled:opacity-50 transition cursor-pointer font-medium"
                  >
                    Aplicar
                  </button>
                </div>
              }
            </div>
          </div>

          <!-- LISTA DE MOVIMIENTOS -->
          <div class="overflow-y-auto p-6 space-y-5 flex-1">
            @for (item of transactions; track $index) {
              <div class="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
                <!-- TOP INFO -->
                <div class="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 class="font-bold text-lg text-slate-900 dark:text-slate-100">{{ item.description }}</h3>
                    <div class="flex items-center gap-3 mt-2">
                      <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" [(ngModel)]="item.selected" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500">
                        <span class="text-sm font-medium text-slate-700 dark:text-slate-300">Importar</span>
                      </label>
                      <div class="font-bold text-lg whitespace-nowrap ml-2" [ngClass]="item.behavior === 'INCOME' ? 'text-emerald-600' : 'text-red-500'">
                        {{ formatCurrency(item.amount) }}
                      </div>
                      <div class="flex flex-col items-start ml-2">
                        <span class="text-xs text-slate-500 font-medium">Fecha: {{ item.record_date }}</span>
                        <button
                          type="button"
                          (click)="item.behavior = item.behavior === 'INCOME' ? 'EXPENSE' : 'INCOME'; item.dashboardId = null;"
                          class="text-xs font-medium px-2 py-0.5 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500 cursor-pointer"
                          [ngClass]="item.behavior === 'INCOME' ? 'border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'border-red-200 text-red-600 bg-red-50 hover:bg-red-100'"
                          title="Haz clic para alternar entre Gasto e Ingreso"
                        >
                          {{ item.behavior === 'INCOME' ? 'Ingreso ⟲' : 'Gasto ⟲' }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap justify-end">
                    @if (item.is_installment) {
                      <span class="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">
                        Pago {{ item.current_installment }} de {{ item.total_installments }} (MSI)
                      </span>
                    } @else if (item.is_recurrent) {
                      <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                        Recurrente ({{ item.occurrences }} veces)
                      </span>
                    }

                    @if (item.is_duplicate) {
                      <span class="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">Posible duplicado</span>
                    } @else if (!item.is_recurrent && !item.is_installment) {
                      <span class="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">Nuevo</span>
                    }
                  </div>
                </div>

                <!-- CATEGORY -->
                <div class="mb-5">
                  <p class="text-sm text-slate-500 dark:text-slate-400 mb-2">Categoría detectada</p>
                  <div class="inline-flex px-3 py-2 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-medium">
                    {{ item.category_name || 'General' }}
                  </div>
                </div>

                <!-- SELECT DASHBOARD -->
                <div>
                  <p class="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300">Selecciona dashboard</p>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    @for (dashboard of getDashboardsForItem(item); track dashboard.id) {
                      <button
                        type="button"
                        (click)="item.dashboardId = dashboard.id"
                        class="text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer"
                        [ngClass]="
                          item.dashboardId === dashboard.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 ring-2 ring-emerald-500/20'
                            : 'border-white/50 dark:border-slate-700/50 hover:border-slate-400 dark:hover:border-slate-500 bg-white dark:bg-slate-900'
                        "
                      >
                        <div class="font-semibold text-slate-900 dark:text-slate-100">{{ dashboard.name }}</div>
                        <div class="text-xs text-slate-500 mt-1">{{ dashboard.description }}</div>
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- FOOTER -->
          <div class="flex justify-between items-center p-6 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div class="text-sm text-slate-500">
              {{ transactions.length }} movimientos detectados
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                (click)="close.emit()"
                class="px-5 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                (click)="submitImport()"
                [disabled]="!canImport() || isConfirming"
                class="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center gap-2"
              >
                @if (isConfirming) {
                  <lucide-angular [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-angular>
                  <span>Importando...</span>
                } @else {
                  <span>Importar movimientos</span>
                }
              </button>
            </div>
          </div>

        </div>
      </div>
    }
  `,
})
export class ImportModalComponent {
  readonly X = X;
  readonly CheckCircle = CheckCircle;
  readonly Loader2 = Loader2;

  @Input() isOpen = false;
  @Input() transactions: ImportedTransactionItem[] = [];
  @Input() dashboards: DashboardItem[] = [];
  @Input() isConfirming = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<ImportedTransactionItem[]>();
  @Output() validationError = new EventEmitter<string>();

  bulkExpenseDashboardId: number | null = null;
  bulkIncomeDashboardId: number | null = null;

  get expenseDashboardsList(): DashboardItem[] {
    return this.dashboards.filter(d => d.dashboard_type === 'EXPENSES' || d.dashboard_type === 'BOTH');
  }

  get incomeDashboardsList(): DashboardItem[] {
    return this.dashboards.filter(d => d.dashboard_type === 'INCOME' || d.dashboard_type === 'BOTH');
  }

  hasExpenses(): boolean {
    return this.transactions.some(t => t.behavior === 'EXPENSE');
  }

  hasIncomes(): boolean {
    return this.transactions.some(t => t.behavior === 'INCOME');
  }

  applyBulkAssign(behavior: 'EXPENSE' | 'INCOME'): void {
    const targetId = behavior === 'EXPENSE' ? this.bulkExpenseDashboardId : this.bulkIncomeDashboardId;
    if (!targetId) return;

    this.transactions.forEach(item => {
      if (item.behavior === behavior) {
        item.dashboardId = targetId;
      }
    });
  }

  getDashboardsForItem(item: ImportedTransactionItem): DashboardItem[] {
    if (item.behavior === 'INCOME') {
      return this.dashboards.filter(d => d.dashboard_type === 'INCOME' || d.dashboard_type === 'BOTH');
    }
    return this.dashboards.filter(d => d.dashboard_type === 'EXPENSES' || d.dashboard_type === 'BOTH');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen && !this.isConfirming) {
      this.close.emit();
    }
  }

  canImport(): boolean {
    const selected = this.transactions.filter(item => item.selected);
    if (selected.length === 0) return false;
    return selected.every(item => item.dashboardId != null);
  }

  submitImport(): void {
    const itemsToImport = this.transactions.filter(item => item.selected);

    if (itemsToImport.length === 0) {
      this.validationError.emit('Debes seleccionar al menos un movimiento para importar');
      return;
    }

    const invalidItems = itemsToImport.filter(item => item.dashboardId == null);
    if (invalidItems.length) {
      this.validationError.emit('Todos los movimientos seleccionados deben tener un dashboard asignado');
      return;
    }

    this.confirm.emit(itemsToImport);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount || 0);
  }
}
