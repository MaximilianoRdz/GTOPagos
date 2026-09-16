import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBarComponent } from '../../atoms/progress-bar/progress-bar.component';

@Component({
  selector: 'app-period-budget-widget',
  standalone: true,
  imports: [CommonModule, ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
      <div class="flex items-center justify-between mb-3">
        <h4 class="font-semibold text-gray-800 dark:text-gray-100">{{ periodTitle }}</h4>
        <span class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-1 rounded-full font-medium">
          {{ budgetPercentage }}% {{ usedLabel }}
        </span>
      </div>

      <div class="space-y-2.5">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">{{ budgetsLabel }}</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ formatCurrency(budgetLimit) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">{{ spentLabel }}</span>
          <span class="font-medium text-red-500">{{ formatCurrency(budgetSpent) }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">{{ remainingLabel }}</span>
          <span
            class="font-medium"
            [ngClass]="(budgetLimit - budgetSpent) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'"
          >
            {{ formatCurrency(budgetLimit - budgetSpent) }}
          </span>
        </div>

        <app-progress-bar
          [value]="budgetPercentage"
          variant="emerald"
          height="sm"
          [showPin]="true"
          class="block mt-3"
        />

        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {{ daysLeftLabel }} {{ budgetDaysLeft }} {{ periodDaysSuffix }}
        </p>
      </div>
    </div>
  `,
})
export class PeriodBudgetWidgetComponent {
  @Input() periodTitle = 'Resumen del Mes';
  @Input() budgetLimit = 0;
  @Input() budgetSpent = 0;
  @Input() budgetPercentage = 0;
  @Input() budgetDaysLeft = 0;
  @Input() periodDaysSuffix = 'para el próximo período';

  @Input() usedLabel = 'utilizado';
  @Input() budgetsLabel = 'Presupuesto';
  @Input() spentLabel = 'Gastado';
  @Input() remainingLabel = 'Restante';
  @Input() daysLeftLabel = 'Quedan';

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }
}
