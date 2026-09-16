import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ProgressBarVariant = 'emerald' | 'amber' | 'rose' | 'blue' | 'gradient' | 'dynamic';
export type ProgressBarHeight = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50"
      [ngClass]="containerHeightClass"
    >
      <div
        class="h-full rounded-full transition-all duration-700 ease-out relative"
        [style.width.%]="percentage"
        [ngClass]="barClasses"
      >
        @if (showPin) {
          <div class="absolute right-0 top-0 h-full aspect-square bg-white/40 rounded-full"></div>
        }
      </div>
    </div>
  `,
})
export class ProgressBarComponent {
  @Input() value: number = 0;
  @Input() max: number = 100;
  @Input() variant: ProgressBarVariant = 'emerald';
  @Input() height: ProgressBarHeight = 'md';
  @Input() showPin: boolean = false;

  get percentage(): number {
    if (!this.max || this.max <= 0) return 0;
    const pct = (this.value / this.max) * 100;
    return Math.min(Math.max(pct, 0), 100);
  }

  get rawPercentage(): number {
    if (!this.max || this.max <= 0) return 0;
    return (this.value / this.max) * 100;
  }

  get containerHeightClass(): string {
    switch (this.height) {
      case 'xs':
        return 'h-1.5';
      case 'sm':
        return 'h-2';
      case 'lg':
        return 'h-4';
      case 'md':
      default:
        return 'h-3';
    }
  }

  get barClasses(): string {
    if (this.variant === 'dynamic') {
      const pct = this.rawPercentage;
      if (pct > 100) return 'bg-rose-500 shadow-sm shadow-rose-500/30';
      if (pct >= 80) return 'bg-amber-500 shadow-sm shadow-amber-500/30';
      return 'bg-emerald-500 shadow-sm shadow-emerald-500/30';
    }

    switch (this.variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-orange-400 to-red-400 shadow-inner';
      case 'amber':
        return 'bg-amber-500 shadow-sm shadow-amber-500/30';
      case 'rose':
        return 'bg-rose-500 shadow-sm shadow-rose-500/30';
      case 'blue':
        return 'bg-blue-500 shadow-sm shadow-blue-500/30';
      case 'emerald':
      default:
        return 'bg-emerald-500 shadow-sm shadow-emerald-500/30';
    }
  }
}
