import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Target, DollarSign, Calendar, CheckCircle2, X } from 'lucide-angular';
import { Goal } from '../../../../core/services/goals/goals.service';

@Component({
  selector: 'app-goal-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" (click)="close.emit()"></div>

        <div class="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-gray-200 dark:border-slate-800">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <lucide-angular [img]="Target" class="w-5 h-5 text-emerald-500"></lucide-angular>
              <span>{{ editingGoal ? 'Editar Meta' : 'Establecer Nueva Meta' }}</span>
            </h3>
            <button
              type="button"
              (click)="close.emit()"
              aria-label="Cerrar modal"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-colors cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-5 h-5"></lucide-angular>
            </button>
          </div>

          <!-- Form Body -->
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                ¿Qué quieres lograr?
              </label>
              <input
                type="text"
                [(ngModel)]="formData.name"
                placeholder="Ej. Silla Ergonómica, Fondo de Emergencia, Vacaciones"
                class="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 dark:text-white text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                ¿Cuánto cuesta?
              </label>
              <div class="relative">
                <lucide-angular [img]="DollarSign" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-angular>
                <input
                  type="number"
                  [(ngModel)]="formData.target_amount"
                  placeholder="0.00"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                ¿Ya tienes algo ahorrado? (Opcional)
              </label>
              <div class="relative">
                <lucide-angular [img]="DollarSign" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-angular>
                <input
                  type="number"
                  [(ngModel)]="formData.saved_amount"
                  placeholder="0.00"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 dark:text-white text-sm outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                Fecha Límite (Opcional)
              </label>
              <div class="relative">
                <lucide-angular [img]="Calendar" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"></lucide-angular>
                <input
                  type="date"
                  [(ngModel)]="formData.target_date"
                  class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 dark:text-white text-sm outline-none transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
            <button
              type="button"
              (click)="close.emit()"
              class="px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <lucide-angular [img]="X" class="w-4 h-4"></lucide-angular>
              <span>Cancelar</span>
            </button>
            <button
              type="button"
              (click)="submit()"
              class="px-5 py-2 text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <lucide-angular [img]="CheckCircle2" class="w-4 h-4"></lucide-angular>
              <span>{{ editingGoal ? 'Actualizar Meta' : 'Guardar Meta' }}</span>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class GoalModalComponent implements OnChanges {
  readonly Target = Target;
  readonly DollarSign = DollarSign;
  readonly Calendar = Calendar;
  readonly CheckCircle2 = CheckCircle2;
  readonly X = X;

  @Input() isOpen = false;
  @Input() editingGoal: Goal | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{
    name: string;
    target_amount: number;
    saved_amount: number;
    target_date: string | null;
  }>();
  @Output() validationError = new EventEmitter<string>();

  formData = {
    name: '',
    target_amount: 0,
    saved_amount: 0,
    target_date: null as string | null,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingGoal'] || changes['isOpen']) {
      if (this.editingGoal) {
        this.formData = {
          name: this.editingGoal.name || '',
          target_amount: Number(this.editingGoal.target_amount) || 0,
          saved_amount: Number(this.editingGoal.saved_amount) || 0,
          target_date: this.editingGoal.target_date || null,
        };
      } else {
        this.formData = {
          name: '',
          target_amount: 0,
          saved_amount: 0,
          target_date: null,
        };
      }
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen) {
      this.close.emit();
    }
  }

  submit(): void {
    if (!this.formData.name.trim()) {
      this.validationError.emit('El nombre de la meta es requerido');
      return;
    }
    if (this.formData.target_amount <= 0) {
      this.validationError.emit('El monto objetivo debe ser mayor a cero');
      return;
    }

    this.save.emit({
      name: this.formData.name.trim(),
      target_amount: Number(this.formData.target_amount),
      saved_amount: Number(this.formData.saved_amount) || 0,
      target_date: this.formData.target_date || null,
    });
  }
}
