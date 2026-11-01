import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, AlertTriangle, X, CheckCircle } from 'lucide-angular';

@Component({
  selector: 'app-upcoming-due-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4" role="dialog" aria-modal="true">
        <div class="w-full max-w-2xl rounded-t-[32px] sm:rounded-3xl bg-white dark:bg-slate-900 border-t sm:border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col pb-safe">
          <!-- Mobile drag handle -->
          <div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0"></div>
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 shrink-0">
            <div class="flex items-center gap-3">
              <div class="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                <lucide-angular [img]="AlertTriangle" class="w-6 h-6"></lucide-angular>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pagos por Vencer o Vencidos</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Atención prioritaria para los próximos 7 días</p>
              </div>
            </div>

            <button
              type="button"
              (click)="close.emit()"
              aria-label="Cerrar modal"
              class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-5 h-5"></lucide-angular>
            </button>
          </div>

          <!-- Body list -->
          <div class="p-6 overflow-y-auto space-y-3 flex-1">
            @for (item of records; track item.id) {
              <div class="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="min-w-0">
                  <div class="flex items-center gap-2">
                    <p class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ item.description }}</p>
                    <span
                      [class]="'text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ' + 
                      (getDaysDueText(item.record_date).isOverdue 
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300')"
                    >
                      {{ getDaysDueText(item.record_date).text }}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{{ item.category?.name || 'General' }}</span>
                    <span>•</span>
                    <span>Fecha límite: {{ item.record_date }}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <p class="text-base font-black text-slate-900 dark:text-white">{{ formatCurrency(item.amount) }}</p>
                  <button
                    type="button"
                    (click)="markPaid.emit(item)"
                    [disabled]="payingRecordId === item.id"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <lucide-angular [img]="CheckCircle" class="w-3.5 h-3.5"></lucide-angular>
                    <span>{{ payingRecordId === item.id ? 'Guardando...' : 'Marcar pagado' }}</span>
                  </button>
                </div>
              </div>
            }
          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-gray-100 dark:border-slate-800 flex justify-end shrink-0">
            <button
              type="button"
              (click)="close.emit()"
              class="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer active:scale-95 text-center"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class UpcomingDueModalComponent {
  readonly AlertTriangle = AlertTriangle;
  readonly X = X;
  readonly CheckCircle = CheckCircle;

  @Input() isOpen = false;
  @Input() records: any[] = [];
  @Input() payingRecordId: number | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() markPaid = new EventEmitter<any>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen && !this.payingRecordId) {
      this.close.emit();
    }
  }

  formatCurrency(amount: any): string {
    const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(num);
  }

  getDaysDueText(dateStr: string): { text: string; isOverdue: boolean } {
    if (!dateStr) return { text: '', isOverdue: false };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr + 'T00:00:00');
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Venció hace ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'día' : 'días'}`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Vence hoy', isOverdue: true };
    } else if (diffDays === 1) {
      return { text: 'Vence mañana', isOverdue: false };
    } else {
      return { text: `Vence en ${diffDays} días`, isOverdue: false };
    }
  }
}
