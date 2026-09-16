import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Loader2 } from 'lucide-angular';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      (click)="handleClick($event)"
      class="inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
      [ngClass]="[variantClasses, sizeClasses, fullWidth ? 'w-full' : '']"
    >
      @if (loading) {
        <lucide-angular [img]="Loader2" class="animate-spin -ml-1 mr-2" [ngClass]="iconSizeClasses"></lucide-angular>
      } @else if (icon && iconPosition === 'left') {
        <lucide-angular [img]="icon" class="-ml-0.5 mr-2" [ngClass]="iconSizeClasses"></lucide-angular>
      }

      <ng-content></ng-content>

      @if (!loading && icon && iconPosition === 'right') {
        <lucide-angular [img]="icon" class="ml-2 -mr-0.5" [ngClass]="iconSizeClasses"></lucide-angular>
      }
    </button>
  `,
})
export class ButtonComponent {
  readonly Loader2 = Loader2;

  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() icon?: any;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() fullWidth = false;

  @Output() btnClick = new EventEmitter<MouseEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }

  get variantClasses(): string {
    switch (this.variant) {
      case 'primary':
        return 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-lg shadow-emerald-500/20 focus:ring-emerald-500 hover:shadow-md hover:-translate-y-0.5';
      case 'secondary':
        return 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:ring-slate-400';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-lg shadow-rose-500/20 focus:ring-rose-500 hover:shadow-md hover:-translate-y-0.5';
      case 'outline':
        return 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 focus:ring-slate-400';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 focus:ring-slate-400';
      default:
        return 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500';
    }
  }

  get sizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs';
      case 'lg':
        return 'px-6 py-3.5 text-base';
      case 'md':
      default:
        return 'px-4 py-2.5 text-sm';
    }
  }

  get iconSizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'w-3.5 h-3.5';
      case 'lg':
        return 'w-5 h-5';
      case 'md':
      default:
        return 'w-4 h-4';
    }
  }
}
