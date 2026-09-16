import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, PiggyBank, DollarSign, X } from 'lucide-angular';
import { Goal } from '../../../../core/services/goals/goals.service';

@Component({
  selector: 'app-add-funds-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (isOpen && goal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" (click)="!savingFunds && close.emit()"></div>

        <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all border border-gray-200 dark:border-slate-800">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <lucide-angular [img]="PiggyBank" class="w-5 h-5 text-emerald-500"></lucide-angular>
              <span>Abonar a Meta</span>
            </h3>
            <button
              type="button"
              [disabled]="savingFunds"
              (click)="close.emit()"
              aria-label="Cerrar modal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-5 h-5"></lucide-angular>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-4">
              <p class="text-xs text-slate-500 dark:text-slate-400">Meta seleccionada</p>
              <p class="font-bold text-sm text-slate-900 dark:text-white truncate mt-0.5">{{ goal.name }}</p>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span class="text-slate-500 dark:text-slate-400">Te faltan:</span>
                <span class="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  {{ formatCurrency(remainingAmount) }}
                </span>
              </div>
            </div>

            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
              ¿Cuánto vas a abonar?
            </label>
            <div class="relative">
              <lucide-angular [img]="DollarSign" class="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"></lucide-angular>
              <input
                type="number"
                min="0.01"
                step="0.01"
                [(ngModel)]="amount"
                placeholder="0.00"
                class="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 dark:text-white text-lg font-bold outline-none transition-all"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
            <button
              type="button"
              [disabled]="savingFunds"
              (click)="close.emit()"
              class="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              [disabled]="savingFunds"
              (click)="submit()"
              class="px-5 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <lucide-angular [img]="PiggyBank" class="w-4 h-4"></lucide-angular>
              <span>{{ savingFunds ? 'Guardando...' : 'Abonar' }}</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class AddFundsModalComponent {
  readonly PiggyBank = PiggyBank;
  readonly DollarSign = DollarSign;
  readonly X = X;

  @Input() isOpen = false;
  @Input() goal: Goal | null = null;
  @Input() savingFunds = false;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<number>();
  @Output() validationError = new EventEmitter<string>();

  amount: number | null = null;

  get remainingAmount(): number {
    if (!this.goal) return 0;
    return Math.max(0, Number(this.goal.target_amount) - Number(this.goal.saved_amount));
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen && !this.savingFunds) {
      this.close.emit();
    }
  }

  submit(): void {
    if (!this.amount || this.amount <= 0) {
      this.validationError.emit('Ingresa un monto válido mayor a 0');
      return;
    }

    this.save.emit(Number(this.amount));
    this.amount = null;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }
}
