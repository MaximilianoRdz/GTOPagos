import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-angular';
import { AlertsService, AlertType } from '../../../core/services/alerts/Alerts.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- TOAST STACK CONTAINER -->
    <div
      class="fixed top-4 right-4 sm:top-6 sm:right-6 z-[9999] flex flex-col gap-2.5 pointer-events-none w-[390px] max-w-[calc(100vw-2rem)]"
      role="region"
      aria-live="polite"
      aria-label="Notificaciones"
    >
      @for (toast of alert.toasts(); track toast.id) {
        <div
          class="pointer-events-auto relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 shadow-xl dark:shadow-2xl animate-toast-enter group"
          [ngClass]="getContainerClasses(toast.type)"
        >
          <!-- ACCENT COLOR INDICATOR -->
          <div class="absolute left-0 top-0 bottom-0 w-1.5" [ngClass]="getAccentBarClass(toast.type)"></div>

          <div class="flex items-start gap-3.5 p-4 pl-5">
            <!-- ICON BADGE -->
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs mt-0.5"
              [ngClass]="getIconBadgeClasses(toast.type)"
            >
              <lucide-angular [img]="getIcon(toast.type)" class="w-5 h-5 stroke-[2.2]"></lucide-angular>
            </div>

            <!-- CONTENT -->
            <div class="min-w-0 flex-1 pt-0.5">
              <h4 class="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>{{ toast.title }}</span>
              </h4>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words font-medium">
                {{ toast.message }}
              </p>
            </div>

            <!-- DISMISS (X) BUTTON -->
            <button
              type="button"
              (click)="alert.dismiss(toast.id)"
              aria-label="Cerrar notificación"
              class="shrink-0 p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-4 h-4"></lucide-angular>
            </button>
          </div>

          <!-- COUNTDOWN PROGRESS BAR -->
          <div class="h-[2.5px] w-full bg-slate-100/60 dark:bg-slate-800/60 overflow-hidden">
            <div
              class="h-full animate-progress"
              [style.animationDuration]="toast.duration + 'ms'"
              [ngClass]="getProgressBarClass(toast.type)"
            ></div>
          </div>
        </div>
      }
    </div>

    <!-- MODAL CONFIRMACIÓN CENTRALIZADO -->
    @if (alert.confirmVisible()) {
      <div
        class="fixed inset-0 z-[10000] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-modal-in">
          <!-- HEADER ICON -->
          <div class="flex justify-center pt-8">
            <div
              class="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner"
              [ngClass]="alert.confirmActionStyle() === 'danger'
                ? 'bg-red-50 dark:bg-red-950/50 text-red-500 border border-red-200 dark:border-red-900/50'
                : 'bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-200 dark:border-amber-900/50'"
            >
              <lucide-angular [img]="AlertTriangle" class="w-8 h-8 stroke-[2]"></lucide-angular>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="px-8 pt-5 pb-6 text-center">
            <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ alert.confirmTitle() }}</h3>
            <p class="mt-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ alert.confirmMessage() }}
            </p>
          </div>

          <!-- ACTIONS -->
          <div class="flex gap-3 p-5 pt-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              type="button"
              (click)="alert.resolveConfirm(false)"
              class="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="alert.resolveConfirm(true)"
              class="flex-1 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all cursor-pointer"
              [ngClass]="alert.confirmActionStyle() === 'danger'
                ? 'bg-red-600 hover:bg-red-700 shadow-red-600/25'
                : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'"
            >
              {{ alert.confirmActionName() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes toast-enter {
      0% {
        opacity: 0;
        transform: translate3d(24px, -12px, 0) scale(0.94);
      }
      100% {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
    }

    @keyframes progress {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    @keyframes modal-in {
      from {
        opacity: 0;
        transform: translateY(16px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .animate-toast-enter {
      will-change: transform, opacity;
      animation: toast-enter 280ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .animate-progress {
      animation-name: progress;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
    }

    .animate-modal-in {
      animation: modal-in 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class AlertsComponent {
  readonly X = X;
  readonly AlertTriangle = AlertTriangle;

  constructor(public alert: AlertsService) {}

  getIcon(type: AlertType) {
    switch (type) {
      case 'success': return CheckCircle2;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
    }
  }

  getContainerClasses(type: AlertType): string {
    switch (type) {
      case 'success':
        return 'bg-white/95 dark:bg-slate-900/95 border-emerald-200/80 dark:border-emerald-800/40 shadow-emerald-500/5';
      case 'error':
        return 'bg-white/95 dark:bg-slate-900/95 border-rose-200/80 dark:border-rose-800/40 shadow-rose-500/5';
      case 'warning':
        return 'bg-white/95 dark:bg-slate-900/95 border-amber-200/80 dark:border-amber-800/40 shadow-amber-500/5';
      case 'info':
        return 'bg-white/95 dark:bg-slate-900/95 border-sky-200/80 dark:border-sky-800/40 shadow-sky-500/5';
    }
  }

  getAccentBarClass(type: AlertType): string {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-rose-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-sky-500';
    }
  }

  getIconBadgeClasses(type: AlertType): string {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40';
      case 'error':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40';
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40';
      case 'info':
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-800/40';
    }
  }

  getProgressBarClass(type: AlertType): string {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'error': return 'bg-rose-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-sky-500';
    }
  }
}