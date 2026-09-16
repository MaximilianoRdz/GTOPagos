import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, formatCurrency } from '@angular/common';
import { LucideAngularModule, FileText } from 'lucide-angular';
import { EmptyStateComponent } from '../../molecules/empty-state/empty-state.component';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block w-full'
  },
  template: `
    <div class="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/30 dark:bg-slate-800/30">
        <div>
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Detalle de Movimientos</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Historial filtrado por el rango seleccionado</p>
        </div>
        <span class="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-full text-xs font-semibold">
          {{ records.length }} {{ records.length === 1 ? 'registro' : 'registros' }}
        </span>
      </div>

      <!-- Table / Empty State -->
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800">
              <th class="py-3.5 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
              <th class="py-3.5 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descripción</th>
              <th class="py-3.5 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoría</th>
              <th class="py-3.5 px-6 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Monto</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-slate-800">
            @for (record of records; track record.id || $index) {
              <tr class="hover:bg-gray-50/70 dark:hover:bg-slate-800/50 transition-colors">
                <td class="py-3.5 px-6 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {{ record.record_date | date:'dd MMM, yyyy' }}
                </td>
                <td class="py-3.5 px-6">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">{{ record.description }}</p>
                </td>
                <td class="py-3.5 px-6">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-gray-300">
                    {{ record.category?.name || 'Sin categoría' }}
                  </span>
                </td>
                <td class="py-3.5 px-6 text-right whitespace-nowrap">
                  <span
                    class="text-sm font-semibold"
                    [ngClass]="record.record_type?.behavior === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'"
                  >
                    {{ record.record_type?.behavior === 'INCOME' ? '+' : '-' }}{{ formatCurrencyValue(record.amount) }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="p-8">
                  <app-empty-state
                    [icon]="FileText"
                    title="Sin movimientos"
                    description="No hay movimientos en el período seleccionado."
                    colorScheme="neutral"
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class ReportTableComponent {
  readonly FileText = FileText;

  @Input() records: any[] = [];

  formatCurrencyValue(value: number): string {
    return formatCurrency(value || 0, 'en-US', '$');
  }
}
