import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save } from 'lucide-angular';
import { Currency, IncomeFrequency, UserProfile } from '../../../../core/services/configuration/configuration.service';

@Component({
  selector: 'app-financial-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Configuración Financiera
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Configura tus preferencias financieras, moneda principal y salario
        </p>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Moneda -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Moneda principal
          </label>
          <select
            [compareWith]="compareFn"
            [(ngModel)]="profile.currency"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none cursor-pointer"
          >
            <option [ngValue]="null" disabled>Selecciona una moneda</option>
            @for (currency of currencies; track currency.id) {
              <option [ngValue]="currency">{{ currency.name }} ({{ currency.code }})</option>
            }
          </select>
        </div>

        <!-- Salario -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Salario base
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            inputmode="decimal"
            [(ngModel)]="profile.salary"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            placeholder="0.00"
          />
        </div>

        <!-- Frecuencia de ingresos -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Frecuencia de ingresos
          </label>
          <select
            [compareWith]="compareFn"
            [(ngModel)]="profile.income_frequency"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none cursor-pointer"
          >
            <option [ngValue]="null" disabled>Selecciona una frecuencia de cobro</option>
            @for (frequency of incomeFrequencies; track frequency.id) {
              <option [ngValue]="frequency">{{ frequency.name }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Guardar -->
      <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
        <button
          type="button"
          (click)="save.emit(profile)"
          [disabled]="loading"
          class="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer font-semibold disabled:opacity-60"
        >
          <lucide-angular [img]="Save" class="w-4 h-4"></lucide-angular>
          <span>{{ loading ? 'Guardando...' : 'Guardar configuración' }}</span>
        </button>
      </div>
    </div>
  `,
})
export class FinancialSettingsComponent {
  readonly Save = Save;

  @Input({ required: true }) profile!: UserProfile;
  @Input() currencies: Currency[] = [];
  @Input() incomeFrequencies: IncomeFrequency[] = [];
  @Input() loading = false;

  @Output() save = new EventEmitter<UserProfile>();

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
