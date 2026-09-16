import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingDown, TrendingUp, Pencil, Trash } from 'lucide-angular';
import { FinancialRecord } from '../../../../core/services/dashboard/dashboard.service';
import { BadgeComponent } from '../../atoms/badge/badge.component';
import { ProgressBarComponent } from '../../atoms/progress-bar/progress-bar.component';

@Component({
  selector: 'app-record-item',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, BadgeComponent, ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="p-4 md:px-8 md:py-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <!-- LEFT -->
      <div class="flex items-start sm:items-center gap-4">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-white/50 dark:border-slate-700/50 shadow-sm"
          [ngClass]="isExpense ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500'"
        >
          <lucide-angular [img]="isExpense ? TrendingDown : TrendingUp" class="w-5 h-5"></lucide-angular>
        </div>

        <div>
          <h4 class="font-bold text-slate-900 dark:text-slate-100 text-base">
            {{ record.description || 'Sin descripción' }}
          </h4>

          <div class="flex items-center gap-2 mt-1 flex-wrap">
            <span class="text-xs font-medium text-slate-500">{{ getSmartDate(record.record_date) }}</span>
            <span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span class="text-xs font-medium text-slate-500">{{ record.category_name || 'General' }}</span>

            @if (isPaid) {
              <app-badge variant="success" [dot]="true">Pagado</app-badge>
            } @else if (isPending) {
              <app-badge variant="warning" [dot]="true">Pendiente</app-badge>
            }

            @if (record.is_recurrent) {
              <app-badge variant="purple">Recurrente</app-badge>
            }
          </div>

          @if (record.payment_type === 'CREDIT' && record.total_installments > 1) {
            <!-- COMPACT MSI WIDGET -->
            <div class="mt-2.5 w-48 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg p-2 border border-slate-200/50 dark:border-slate-700/50">
              <div class="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                <span>Pago {{ record.current_installment || 1 }}/{{ record.total_installments }}</span>
              </div>
              <app-progress-bar
                [value]="record.current_installment || 1"
                [max]="record.total_installments"
                variant="gradient"
                height="xs"
              />
            </div>
          }
        </div>
      </div>

      <!-- RIGHT -->
      <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-16 sm:pl-0">
        <p
          class="text-lg font-black tracking-tight"
          [ngClass]="isExpense ? 'text-slate-900 dark:text-white' : 'text-emerald-600 dark:text-emerald-400'"
        >
          {{ isExpense ? '-' : '+' }}{{ formatCurrency(record.amount) }}
        </p>

        @if (!isPaid) {
          <div class="flex sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              (click)="edit.emit(record); $event.stopPropagation()"
              class="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-700 cursor-pointer transition-all"
              title="Editar movimiento"
            >
              <lucide-angular [img]="Pencil" class="w-4 h-4"></lucide-angular>
            </button>
            <button
              (click)="delete.emit(record.id); $event.stopPropagation()"
              class="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all"
              title="Eliminar movimiento"
            >
              <lucide-angular [img]="Trash" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        } @else {
          <div class="w-[72px] hidden sm:block"></div>
        }
      </div>
    </div>
  `,
})
export class RecordItemComponent {
  readonly TrendingDown = TrendingDown;
  readonly TrendingUp = TrendingUp;
  readonly Pencil = Pencil;
  readonly Trash = Trash;

  @Input({ required: true }) record!: FinancialRecord;
  @Input() isExpense = true;
  @Input() isPaid = false;
  @Input() isPending = false;

  @Output() edit = new EventEmitter<FinancialRecord>();
  @Output() delete = new EventEmitter<number>();

  getSmartDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString + 'T12:00:00');
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const diffMs = today.getTime() - date.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays === -1) return 'Mañana';
    if (diffDays > 1 && diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < -1 && diffDays > -7) return `En ${Math.abs(diffDays)} días`;

    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }

  formatCurrency(amount: string | number): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(num || 0);
  }
}
