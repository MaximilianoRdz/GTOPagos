import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (alert.visible()) {

      <div
        class="fixed top-5 right-5 z-[9999]
              w-[370px] max-w-[calc(100vw-2rem)]
              overflow-hidden rounded-[28px]
              border shadow-xl
              animate-toast-enter"

        [ngClass]="{
          'bg-white border-slate-200 shadow-slate-200/60 dark:bg-slate-900 dark:border-slate-800':
            true
        }"
      >

        <div class="flex gap-4 p-5">

          <!-- ICON -->
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold text-lg"

            [ngClass]="{
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400':
                alert.type() === 'success',

              'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400':
                alert.type() === 'error',

              'bg-blue-100 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400':
                alert.type() === 'info'
            }"
          >

            @if (alert.type() === 'success') {
              ✓
            }

            @if (alert.type() === 'error') {
              !
            }

            @if (alert.type() === 'info') {
              i
            }

          </div>

          <!-- CONTENT -->
          <div class="min-w-0 flex-1">

            <h4
              class="font-semibold text-[15px]
                    text-slate-900 dark:text-slate-100">

              {{
                alert.type() === 'success'
                  ? 'Éxito'
                  : alert.type() === 'error'
                    ? 'Error'
                    : 'Información'
              }}

            </h4>

            <p
              class="mt-1 text-sm leading-relaxed
                    text-slate-500 dark:text-slate-400">

              {{ alert.message() }}
            </p>
          </div>

        </div>

        <!-- PROGRESS -->
        <div class="h-[3px] bg-slate-100 dark:bg-slate-800">

          <div
            class="h-full animate-progress"

            [ngClass]="{
              'bg-emerald-500':
                alert.type() === 'success',

              'bg-red-500':
                alert.type() === 'error',

              'bg-blue-500':
                alert.type() === 'info'
            }"
          ></div>

        </div>

      </div>
    }

    <!-- Modal Confirmación Centralizado -->
    @if (alert.confirmVisible()) {
      <div class="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-[32px] bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-modal-in">
          
          <!-- HEADER ICON -->
          <div class="flex justify-center pt-8">
            <div class="flex h-20 w-20 items-center justify-center rounded-full"
                 [ngClass]="alert.confirmActionStyle() === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-orange-100 dark:bg-orange-900/30'">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9" [ngClass]="alert.confirmActionStyle() === 'danger' ? 'text-red-500' : 'text-orange-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <!-- CONTENT -->
          <div class="px-8 pt-6 pb-8 text-center">
            <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">{{ alert.confirmTitle() }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {{ alert.confirmMessage() }}
            </p>
          </div>

          <!-- FOOTER -->
          <div class="flex gap-3 p-5 border-t border-gray-200 dark:border-slate-800">
            <button (click)="alert.resolveConfirm(false)" class="flex-1 rounded-2xl border border-slate-300 dark:border-slate-700 px-4 py-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
              Cancelar
            </button>
            <button (click)="alert.resolveConfirm(true)" class="flex-1 rounded-2xl px-4 py-3 font-semibold text-white shadow-lg transition cursor-pointer"
                    [ngClass]="alert.confirmActionStyle() === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'">
              {{ alert.confirmActionName() }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`
    @keyframes toast-enter {
      0% {
        opacity: 0;
        transform:
          translate3d(40px, -10px, 0)
          scale(.96);
      }

      100% {
        opacity: 1;
        transform:
          translate3d(0, 0, 0)
          scale(1);
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
        transform:
          translateY(14px)
          scale(.96);
      }

      to {
        opacity: 1;
        transform:
          translateY(0)
          scale(1);
      }
    }

    .animate-toast-enter {
      will-change: transform, opacity;

      animation:
        toast-enter 320ms
        cubic-bezier(.16, 1, .3, 1);
    }

    .animate-progress {
      animation:
        progress 3.5s linear forwards;
    }

    .animate-modal-in {
      animation:
        modal-in .28s
        cubic-bezier(.16,1,.3,1);
    }
  `]
})
export class AlertsComponent {
  constructor(public alert: AlertsService) {}
}