import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';
export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors duration-200"
      [ngClass]="[variantClasses, sizeClasses]"
    >
      @if (dot) {
        <span class="w-1.5 h-1.5 rounded-full" [ngClass]="dotClasses"></span>
      }
      @if (icon) {
        <lucide-angular [img]="icon" [class]="iconSizeClasses"></lucide-angular>
      }
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() size: BadgeSize = 'sm';
  @Input() icon?: any;
  @Input() dot = false;

  get variantClasses(): string {
    switch (this.variant) {
      case 'success':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200/80 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/25';
      case 'warning':
        return 'bg-amber-100 text-amber-800 border-amber-200/80 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/25';
      case 'danger':
        return 'bg-rose-100 text-rose-800 border-rose-200/80 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/25';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200/80 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/25';
      case 'purple':
        return 'bg-purple-100 text-purple-800 border-purple-200/80 dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/25';
      case 'neutral':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  }

  get sizeClasses(): string {
    return this.size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  }

  get iconSizeClasses(): string {
    return this.size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  }

  get dotClasses(): string {
    switch (this.variant) {
      case 'success':
        return 'bg-emerald-500 dark:bg-emerald-400';
      case 'warning':
        return 'bg-amber-500 dark:bg-amber-400';
      case 'danger':
        return 'bg-rose-500 dark:bg-rose-400';
      case 'info':
        return 'bg-blue-500 dark:bg-blue-400';
      case 'purple':
        return 'bg-purple-500 dark:bg-purple-400';
      case 'neutral':
      default:
        return 'bg-slate-400 dark:bg-slate-500';
    }
  }
}
