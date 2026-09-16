import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialAdviceCardComponent } from '../financial-advice-card/financial-advice-card.component';

@Component({
  selector: 'app-goals-summary-card',
  standalone: true,
  imports: [CommonModule, FinancialAdviceCardComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 space-y-6">
      <div>
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Resumen de Metas</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
            <span class="text-gray-600 dark:text-gray-400 text-sm font-medium">Metas Activas</span>
            <span class="text-gray-900 dark:text-white font-bold">{{ activeGoalsCount }}</span>
          </div>
          <div class="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-slate-800/60 rounded-xl">
            <span class="text-gray-600 dark:text-gray-400 text-sm font-medium">Ahorro Guardado</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold">
              {{ formatCurrency(totalSavedAmount) }}
            </span>
          </div>
        </div>
      </div>

      <div class="pt-6 border-t border-gray-100 dark:border-slate-800">
        <app-financial-advice-card context="goals" />
      </div>
    </div>
  `,
})
export class GoalsSummaryCardComponent {
  @Input() activeGoalsCount = 0;
  @Input() totalSavedAmount = 0;

  formatCurrency(val: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(val || 0);
  }
}
