import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../../atoms/button/button.component';

export type EmptyStateColorScheme = 'emerald' | 'blue' | 'amber' | 'rose' | 'neutral';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="text-center transition-all duration-300 flex flex-col items-center justify-center"
      [ngClass]="[
        bordered ? 'rounded-3xl shadow-sm border border-white/50 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/50' : '',
        padding === 'large' ? 'py-16 md:py-20 px-6' : 'py-10 md:py-12 px-4'
      ]"
    >
      @if (icon) {
        <div
          class="w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center mx-auto mb-5 border-2 transition-transform duration-300 hover:scale-105"
          [ngClass]="iconContainerClasses"
        >
          <lucide-angular [img]="icon" class="w-10 h-10 md:w-12 md:h-12" [ngClass]="iconColorClasses"></lucide-angular>
        </div>
      }

      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {{ title }}
      </h3>

      <p class="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto text-sm md:text-base leading-relaxed" [ngClass]="actionText ? 'mb-6' : ''">
        {{ description }}
      </p>

      @if (actionText) {
        <app-button
          variant="primary"
          size="md"
          [icon]="actionIcon"
          (btnClick)="actionClick.emit()"
        >
          {{ actionText }}
        </app-button>
      }

      <ng-content></ng-content>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) description!: string;
  @Input() icon?: any;
  @Input() actionText?: string;
  @Input() actionIcon?: any;
  @Input() colorScheme: EmptyStateColorScheme = 'emerald';
  @Input() bordered: boolean = false;
  @Input() padding: 'normal' | 'large' = 'normal';

  @Output() actionClick = new EventEmitter<void>();

  get iconContainerClasses(): string {
    switch (this.colorScheme) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-900/15 border-blue-100 dark:border-blue-800/30 shadow-inner';
      case 'amber':
        return 'bg-amber-50 dark:bg-amber-900/15 border-amber-100 dark:border-amber-800/30 shadow-inner';
      case 'rose':
        return 'bg-rose-50 dark:bg-rose-900/15 border-rose-100 dark:border-rose-800/30 shadow-inner';
      case 'neutral':
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-inner';
      case 'emerald':
      default:
        return 'bg-emerald-50 dark:bg-emerald-900/15 border-emerald-100 dark:border-emerald-800/30 shadow-inner';
    }
  }

  get iconColorClasses(): string {
    switch (this.colorScheme) {
      case 'blue':
        return 'text-blue-500 dark:text-blue-400';
      case 'amber':
        return 'text-amber-500 dark:text-amber-400';
      case 'rose':
        return 'text-rose-500 dark:text-rose-400';
      case 'neutral':
        return 'text-slate-500 dark:text-slate-400';
      case 'emerald':
      default:
        return 'text-emerald-500 dark:text-emerald-400';
    }
  }
}
