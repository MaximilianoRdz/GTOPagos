import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, TrendingUp, TrendingDown } from 'lucide-angular';

export type StatColorScheme = 'neutral' | 'emerald' | 'amber' | 'blue' | 'rose';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full h-full'
  },
  template: `
    <div
      class="h-full flex flex-col justify-between p-6 rounded-2xl md:rounded-3xl border shadow-sm transition-all duration-200 backdrop-blur-md"
      [ngClass]="cardClasses"
    >
      <div class="flex items-start justify-between mb-3">
        <div class="space-y-1">
          <p class="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{{ title }}</p>
          <p class="text-2xl xl:text-3xl font-bold tracking-tight" [ngClass]="valueClasses">
            {{ value }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          @if (trend) {
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border"
              [ngClass]="trend === 'up'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25'
                : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25'"
            >
              <lucide-angular
                [img]="trend === 'up' ? TrendingUp : TrendingDown"
                class="w-3 h-3 mr-1"
              ></lucide-angular>
              {{ trendText }}
            </span>
          }

          @if (icon) {
            <div
              class="p-2.5 rounded-xl border transition-colors"
              [ngClass]="iconContainerClasses"
            >
              <lucide-angular [img]="icon" class="w-5 h-5" [ngClass]="iconClasses"></lucide-angular>
            </div>
          }
        </div>
      </div>

      @if (subtitle) {
        <p class="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">{{ subtitle }}</p>
      }
    </div>
  `,
})
export class StatCardComponent {
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;

  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input() subtitle?: string;
  @Input() icon?: any;
  @Input() colorScheme: StatColorScheme = 'neutral';
  @Input() trend?: 'up' | 'down' | null;
  @Input() trendText?: string;
  @Input() isNegative = false;

  get cardClasses(): string {
    if (this.isNegative) {
      return 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40';
    }
    return 'bg-white/70 dark:bg-slate-900/60 border-gray-100 dark:border-slate-800';
  }

  get iconContainerClasses(): string {
    if (this.isNegative) {
      return 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800/40';
    }
    switch (this.colorScheme) {
      case 'emerald':
        return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-100 dark:border-emerald-800/40';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800/40';
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800/40';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800/40';
      case 'neutral':
      default:
        return 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800';
    }
  }

  get valueClasses(): string {
    if (this.isNegative) {
      return 'text-rose-600 dark:text-rose-400';
    }
    switch (this.colorScheme) {
      case 'emerald':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'amber':
        return 'text-amber-600 dark:text-amber-400';
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'rose':
        return 'text-rose-600 dark:text-rose-400';
      case 'neutral':
      default:
        return 'text-slate-900 dark:text-white';
    }
  }

  get iconClasses(): string {
    if (this.isNegative) {
      return 'text-rose-600 dark:text-rose-400';
    }
    switch (this.colorScheme) {
      case 'emerald':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'amber':
        return 'text-amber-600 dark:text-amber-400';
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'rose':
        return 'text-rose-600 dark:text-rose-400';
      case 'neutral':
      default:
        return 'text-slate-600 dark:text-slate-300';
    }
  }
}
