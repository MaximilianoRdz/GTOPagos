import { Component } from '@angular/core';
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
  `,
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