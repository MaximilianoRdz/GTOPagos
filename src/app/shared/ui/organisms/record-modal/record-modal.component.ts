import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, TrendingDown, TrendingUp, X, AlertTriangle, Loader2 } from 'lucide-angular';
import { Category, PaymentStatus, FinancialRecord, CreateFinancialRecordPayload } from '../../../../core/services/dashboard/dashboard.service';
import { HapticsService } from '../../../../core/services/native/haptics.service';

export interface RecordModalSaveEvent {
  payload: Partial<CreateFinancialRecordPayload>;
  isEditing: boolean;
  recordId?: number;
}

@Component({
  selector: 'app-record-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4" role="dialog" aria-modal="true">
        <div class="w-full max-w-lg rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-slate-900 border-t sm:border border-gray-200 dark:border-slate-700 shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col pb-safe">
          <!-- Handle bar for mobile gestures -->
          <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0"></div>
          <!-- HEADER -->
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 px-6 py-4 sm:py-5 shrink-0">
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <lucide-angular [img]="isExpenses ? TrendingDown : TrendingUp" class="w-6 h-6 text-emerald-500"></lucide-angular>
                {{ editingRecord ? 'Editar ' + currentRecordTypeName : 'Agregar ' + currentRecordTypeName }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ editingRecord ? 'Modifica el movimiento' : 'Registra un nuevo movimiento' }}
              </p>
            </div>

            <button
              type="button"
              (click)="onClose()"
              aria-label="Cerrar modal"
              class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-5 h-5"></lucide-angular>
            </button>
          </div>

          <!-- BODY -->
          <div class="p-6 space-y-5 overflow-y-auto flex-1">
            <!-- MONTO -->
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Monto</label>
                @if (isExpenses && periodLimit > 0) {
                  <span class="text-xs text-slate-500 dark:text-slate-400">
                    Límite ({{ currentPeriodLabel }}): <strong class="text-slate-700 dark:text-slate-300">{{ formatCurrency(periodLimit) }}</strong>
                  </span>
                }
              </div>

              <input
                type="number"
                [(ngModel)]="formData.amount"
                class="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="0.00"
              />

              <!-- AVISO DE LÍMITE EN MODAL -->
              @if (isExpenses && periodLimit > 0 && formData.amount && formData.amount > 0) {
                @if (willExceedLimit) {
                  <div class="mt-2.5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-fade-in">
                    <lucide-angular [img]="AlertTriangle" class="w-4 h-4 text-red-500 shrink-0 mt-0.5"></lucide-angular>
                    <div>
                      <span class="font-bold text-red-800 dark:text-red-200">¡Superarás tu presupuesto!</span>
                      <p class="mt-0.5 leading-relaxed">
                        Con este gasto alcanzarás el <strong>{{ projectedUsagePercentage | number:'1.0-1' }}%</strong> de tu límite ({{ formatCurrency(periodLimit) }}), excediéndote por <strong class="text-red-900 dark:text-red-100 font-extrabold">{{ formatCurrency(projectedExceededAmount) }}</strong>.
                      </p>
                    </div>
                  </div>
                } @else if (willBeNearLimit) {
                  <div class="mt-2.5 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-300 animate-fade-in">
                    <lucide-angular [img]="AlertTriangle" class="w-4 h-4 text-amber-500 shrink-0 mt-0.5"></lucide-angular>
                    <div>
                      <span class="font-bold text-amber-800 dark:text-amber-200">¡Cerca de tu límite!</span>
                      <p class="mt-0.5 leading-relaxed">
                        Este movimiento te dejará al <strong>{{ projectedUsagePercentage | number:'1.0-1' }}%</strong> de tu presupuesto disponible para este período.
                      </p>
                    </div>
                  </div>
                }
              }
            </div>

            <!-- DESCRIPCIÓN -->
            <div>
              <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Descripción</label>
              <input
                type="text"
                [(ngModel)]="formData.description"
                class="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder="Ej. Pago de internet"
              />
            </div>

            <!-- CATEGORÍA -->
            <div>
              <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Categoría</label>
              <select
                [(ngModel)]="formData.category_id"
                class="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option [ngValue]="null">Selecciona una categoría</option>
                @for (category of categories; track category.id) {
                  <option [value]="category.id">{{ category.name }}</option>
                }
              </select>
            </div>

            <!-- ESTADO DE PAGO -->
            <div>
              <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Estado de pago</label>
              <select
                [(ngModel)]="formData.payment_status_id"
                class="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option [ngValue]="null">Selecciona el estado</option>
                @for (status of paymentStatuses; track status.id) {
                  <option [value]="status.id">{{ status.status }}</option>
                }
              </select>
            </div>

            <!-- TIPO DE PAGO (Solo gastos) -->
            @if (isExpenses) {
              <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Compra a crédito o MSI</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Activa si el gasto no fue de contado</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="isCredit" class="sr-only peer" />
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <!-- MESES SIN INTERESES -->
              @if (isCredit) {
                <div>
                  <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                    Meses sin intereses
                  </label>
                  <select
                    [(ngModel)]="formData.total_installments"
                    class="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    @for (month of installmentOptions; track month) {
                      <option [value]="month">{{ month }} meses</option>
                    }
                  </select>
                </div>
              }
            }

            <!-- MOVIMIENTO RECURRENTE -->
            <div class="flex items-center justify-between py-2 border-b border-gray-100 dark:border-slate-800">
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Movimiento recurrente</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Activa si se repite cada mes</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" [(ngModel)]="formData.is_recurrent" class="sr-only peer" />
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
              </label>
            </div>

            <!-- FECHA -->
            <div>
              <label class="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Fecha</label>
              <input
                type="date"
                [(ngModel)]="formData.record_date"
                class="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <!-- FOOTER -->
          <div class="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 border-t border-gray-200 dark:border-slate-700 p-4 sm:p-6 shrink-0">
            <button
              type="button"
              (click)="onClose()"
              class="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer active:scale-95 text-center"
            >
              Cancelar
            </button>

            <button
              type="button"
              (click)="onSubmit()"
              [disabled]="creatingRecord"
              class="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold transition-all shadow-md shadow-emerald-600/20 cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95"
            >
              @if (creatingRecord) {
                <lucide-angular [img]="Loader2" class="w-4 h-4 animate-spin"></lucide-angular>
                <span>Guardando...</span>
              } @else {
                <span>{{ editingRecord ? 'Guardar cambios' : 'Crear ' + currentRecordTypeName.toLowerCase() }}</span>
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class RecordModalComponent implements OnChanges {
  readonly TrendingDown = TrendingDown;
  readonly TrendingUp = TrendingUp;
  readonly X = X;
  readonly AlertTriangle = AlertTriangle;
  readonly Loader2 = Loader2;

  @Input() isOpen = false;
  @Input() editingRecord: FinancialRecord | null = null;
  @Input() isExpenses = true;
  @Input() currentRecordTypeName = 'Gasto';
  @Input() periodLimit = 0;
  @Input() currentPeriodLabel = '';
  @Input() categories: Category[] = [];
  @Input() paymentStatuses: PaymentStatus[] = [];
  @Input() paidStatusId: number | null = null;
  @Input() pendingStatusId: number | null = null;
  @Input() currentExpenseAmount = 0;
  @Input() creatingRecord = false;
  @Input() installmentOptions: number[] = [1, 3, 6, 9, 12, 18, 24];

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<RecordModalSaveEvent>();
  @Output() validationError = new EventEmitter<string>();

  isCredit = false;

  formData = {
    amount: null as number | null,
    description: '',
    category_id: null as number | null,
    payment_status_id: null as number | null,
    payment_type: 'DEBIT' as 'DEBIT' | 'CREDIT',
    total_installments: 1,
    record_date: new Date().toISOString().split('T')[0],
    is_recurrent: false,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingRecord'] || (changes['isOpen'] && this.isOpen)) {
      if (this.editingRecord) {
        this.isCredit = this.editingRecord.payment_type === 'CREDIT';
        this.formData = {
          amount: Number(this.editingRecord.amount),
          description: this.editingRecord.description || '',
          category_id: this.editingRecord.category_id,
          payment_status_id: this.editingRecord.payment_status_id,
          payment_type: this.editingRecord.payment_type,
          total_installments: this.editingRecord.total_installments || 1,
          record_date: this.editingRecord.record_date,
          is_recurrent: this.editingRecord.is_recurrent || false,
        };
      } else {
        this.resetForm();
      }
    }
  }

  resetForm(): void {
    this.isCredit = false;
    this.formData = {
      amount: null,
      description: '',
      category_id: null,
      payment_status_id: null,
      payment_type: 'DEBIT',
      total_installments: 1,
      record_date: new Date().toISOString().split('T')[0],
      is_recurrent: false,
    };
  }

  get willExceedLimit(): boolean {
    if (!this.isExpenses || !this.periodLimit || this.periodLimit <= 0) return false;
    const inputAmount = Number(this.formData.amount || 0);
    if (inputAmount <= 0) return false;

    const existingAmount = this.editingRecord ? Number(this.editingRecord.amount || 0) : 0;
    const projected = this.currentExpenseAmount - existingAmount + inputAmount;
    return projected >= this.periodLimit;
  }

  get willBeNearLimit(): boolean {
    if (!this.isExpenses || !this.periodLimit || this.periodLimit <= 0) return false;
    const inputAmount = Number(this.formData.amount || 0);
    if (inputAmount <= 0) return false;

    const existingAmount = this.editingRecord ? Number(this.editingRecord.amount || 0) : 0;
    const projected = this.currentExpenseAmount - existingAmount + inputAmount;
    const projectedPercentage = (projected / this.periodLimit) * 100;
    return projectedPercentage >= 80 && projectedPercentage < 100;
  }

  get projectedUsagePercentage(): number {
    if (!this.periodLimit || this.periodLimit <= 0) return 0;
    const inputAmount = Number(this.formData.amount || 0);
    const existingAmount = this.editingRecord ? Number(this.editingRecord.amount || 0) : 0;
    const projected = this.currentExpenseAmount - existingAmount + inputAmount;
    return Math.round((projected / this.periodLimit) * 1000) / 10;
  }

  get projectedExceededAmount(): number {
    if (!this.periodLimit || this.periodLimit <= 0) return 0;
    const inputAmount = Number(this.formData.amount || 0);
    const existingAmount = this.editingRecord ? Number(this.editingRecord.amount || 0) : 0;
    const projected = this.currentExpenseAmount - existingAmount + inputAmount;
    return Math.max(0, projected - this.periodLimit);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  private haptics = inject(HapticsService);

  onClose(): void {
    this.haptics.impactLight();
    this.close.emit();
    this.resetForm();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen && !this.creatingRecord) {
      this.onClose();
    }
  }

  onSubmit(): void {
    if (this.creatingRecord) return;

    if (this.formData.amount === null || this.formData.amount <= 0) {
      this.haptics.warning();
      this.validationError.emit('Monto requerido');
      return;
    }

    if (!this.formData.category_id) {
      this.haptics.warning();
      this.validationError.emit('Categoría requerida');
      return;
    }

    this.haptics.success();
    const payload: Partial<CreateFinancialRecordPayload> = {
      amount: this.formData.amount,
      description: this.formData.description,
      category_id: this.formData.category_id,
      record_date: this.formData.record_date,
      is_recurrent: this.formData.is_recurrent,
      payment_status_id: this.formData.payment_status_id
        ? this.formData.payment_status_id
        : (this.isCredit ? this.pendingStatusId : this.paidStatusId),
      payment_type: (this.isCredit ? 'CREDIT' : 'DEBIT') as 'CREDIT' | 'DEBIT',
      total_installments: this.isCredit ? this.formData.total_installments || 1 : 1,
    };

    this.save.emit({
      payload,
      isEditing: !!this.editingRecord,
      recordId: this.editingRecord?.id,
    });
  }
}
