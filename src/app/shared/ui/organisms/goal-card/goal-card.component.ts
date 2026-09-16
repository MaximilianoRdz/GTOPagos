import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, PiggyBank, Edit, Trash2, Trophy, CalendarClock, Sparkles } from 'lucide-angular';
import { ProgressBarComponent } from '../../atoms/progress-bar/progress-bar.component';

export interface GoalMetrics {
  id?: number;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string | null;
  disposableIncome?: number;
  monthsToReach?: number;
  recommendedSavings?: number;
  progressPercentage: number;
}

@Component({
  selector: 'app-goal-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-white/50 dark:border-slate-700/50 p-6 flex flex-col h-full">
      <!-- Meta Header -->
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">{{ goal.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Objetivo: {{ formatCurrency(goal.target_amount) }}</p>
        </div>
        <div class="flex items-center gap-2">
          <div class="bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full border border-gray-200 dark:border-gray-600">
            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ goal.progressPercentage.toFixed(0) }}%
            </span>
          </div>

          @if (!isCompleted) {
            <button
              (click)="addFunds.emit(goal)"
              class="p-1.5 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer"
              title="Abonar a Meta"
            >
              <lucide-angular [img]="PiggyBank" class="w-4 h-4"></lucide-angular>
            </button>
          }

          <button
            (click)="edit.emit(goal)"
            class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
            title="Editar Meta"
          >
            <lucide-angular [img]="Edit" class="w-4 h-4"></lucide-angular>
          </button>

          <button
            (click)="delete.emit(goal.id!)"
            class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            title="Eliminar Meta"
          >
            <lucide-angular [img]="Trash2" class="w-4 h-4"></lucide-angular>
          </button>
        </div>
      </div>

      <!-- Progress Bar (Atomic Component) -->
      <app-progress-bar
        [value]="goal.progressPercentage"
        variant="emerald"
        height="md"
        class="mb-2"
      />

      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium mb-6">
        <span>Ahorrado: {{ formatCurrency(goal.saved_amount) }}</span>
        <span>Restante: {{ formatCurrency(remainingAmount) }}</span>
      </div>

      <!-- Proyection Box -->
      <div class="mt-auto bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30">
        @if (isCompleted) {
          <div class="flex flex-col items-center justify-center text-center py-2">
            <div class="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full mb-2">
              <lucide-angular [img]="Trophy" class="w-6 h-6 text-yellow-600 dark:text-yellow-500"></lucide-angular>
            </div>
            <h4 class="text-sm font-bold text-yellow-800 dark:text-yellow-400">¡Meta lograda!</h4>
            <p class="text-xs text-yellow-700 dark:text-yellow-500 mt-1">Felicidades por alcanzar tu objetivo.</p>
          </div>
        } @else {
          <h4 class="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-3 flex items-center gap-2">
            <lucide-angular [img]="goal.target_date ? CalendarClock : Sparkles" class="w-4 h-4"></lucide-angular>
            {{ goal.target_date ? 'Plan para fecha límite' : 'Plan de ahorro recomendado' }}
          </h4>

          @if (goal.monthsToReach && goal.monthsToReach < 999) {
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium uppercase tracking-wider">Tiempo estimado</p>
                <p class="text-lg font-bold text-emerald-700 dark:text-emerald-300">{{ goal.monthsToReach }} meses</p>
              </div>
              <div>
                <p class="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-medium uppercase tracking-wider">Ahorro mensual</p>
                <p class="text-lg font-bold text-emerald-700 dark:text-emerald-300">{{ formatCurrency(goal.recommendedSavings || 0) }}</p>
              </div>
            </div>
          } @else {
            <p class="text-xs text-amber-600 dark:text-amber-400 leading-relaxed font-medium">
              Ajusta tus gastos para generar margen de ahorro y ver un plan estimado para esta meta.
            </p>
          }
        }
      </div>
    </div>
  `,
})
export class GoalCardComponent {
  readonly PiggyBank = PiggyBank;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Trophy = Trophy;
  readonly CalendarClock = CalendarClock;
  readonly Sparkles = Sparkles;

  @Input({ required: true }) goal!: GoalMetrics;
  @Input() isCompleted = false;

  @Output() addFunds = new EventEmitter<GoalMetrics>();
  @Output() edit = new EventEmitter<GoalMetrics>();
  @Output() delete = new EventEmitter<number>();

  get remainingAmount(): number {
    return Math.max(0, this.goal.target_amount - this.goal.saved_amount);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }
}
