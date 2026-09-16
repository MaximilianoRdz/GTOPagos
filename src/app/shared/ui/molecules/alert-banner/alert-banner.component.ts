import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type AlertBannerVariant = 'danger' | 'warning' | 'info' | 'success';

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full'
  },
  template: `
    <div
      class="p-4 sm:p-5 rounded-2xl md:rounded-3xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all backdrop-blur-md"
      [ngClass]="containerClasses"
    >
      <div class="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
        @if (icon) {
          <div
            class="p-2.5 rounded-xl shrink-0 mt-0.5 sm:mt-0 shadow-sm transition-colors"
            [ngClass]="iconContainerClasses"
          >
            <lucide-angular [img]="icon" class="w-5 h-5"></lucide-angular>
          </div>
        }

        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
            <h4 class="font-bold text-sm sm:text-base flex items-center gap-2" [ngClass]="titleClasses">
              {{ title }}
            </h4>

            @if (badgeText) {
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold w-fit shrink-0"
                [ngClass]="badgeClasses"
              >
                {{ badgeText }}
              </span>
            }
          </div>

          @if (description) {
            <p class="text-xs sm:text-sm mt-1 leading-relaxed" [ngClass]="descriptionClasses">
              {{ description }}
            </p>
          }

          <ng-content></ng-content>
        </div>
      </div>

      @if (actionText) {
        <button
          type="button"
          (click)="actionClick.emit()"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer shrink-0 self-start sm:self-auto"
          [ngClass]="actionButtonClasses"
        >
          <span>{{ actionText }}</span>
        </button>
      }
    </div>
  `,
})
export class AlertBannerComponent {
  @Input({ required: true }) title!: string;
  @Input() description?: string;
  @Input() icon?: any;
  @Input() variant: AlertBannerVariant = 'warning';
  @Input() badgeText?: string;
  @Input() actionText?: string;

  @Output() actionClick = new EventEmitter<void>();

  get containerClasses(): string {
    switch (this.variant) {
      case 'danger':
        return 'bg-red-50/90 dark:bg-red-950/40 border-red-200/80 dark:border-red-900/60';
      case 'info':
        return 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-200/80 dark:border-blue-900/60';
      case 'success':
        return 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-900/60';
      case 'warning':
      default:
        return 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-900/60';
    }
  }

  get iconContainerClasses(): string {
    switch (this.variant) {
      case 'danger':
        return 'bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-400';
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400';
      case 'success':
        return 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400';
      case 'warning':
      default:
        return 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400';
    }
  }

  get titleClasses(): string {
    switch (this.variant) {
      case 'danger':
        return 'text-red-900 dark:text-red-200';
      case 'info':
        return 'text-blue-900 dark:text-blue-200';
      case 'success':
        return 'text-emerald-900 dark:text-emerald-200';
      case 'warning':
      default:
        return 'text-amber-900 dark:text-amber-300';
    }
  }

  get descriptionClasses(): string {
    switch (this.variant) {
      case 'danger':
        return 'text-red-700 dark:text-red-300';
      case 'info':
        return 'text-blue-700 dark:text-blue-300';
      case 'success':
        return 'text-emerald-700 dark:text-emerald-300';
      case 'warning':
      default:
        return 'text-amber-800/80 dark:text-amber-400/80';
    }
  }

  get badgeClasses(): string {
    switch (this.variant) {
      case 'danger':
        return 'bg-red-200 dark:bg-red-900/80 text-red-800 dark:text-red-200';
      case 'info':
        return 'bg-blue-200 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200';
      case 'success':
        return 'bg-emerald-200 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200';
      case 'warning':
      default:
        return 'bg-amber-200 dark:bg-amber-900/80 text-amber-800 dark:text-amber-200';
    }
  }

  get actionButtonClasses(): string {
    switch (this.variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 shadow-red-500/20';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20';
      case 'warning':
      default:
        return 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20';
    }
  }
}
