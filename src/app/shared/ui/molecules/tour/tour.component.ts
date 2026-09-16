import {
  Component,
  ChangeDetectionStrategy,
  HostListener,
  inject,
  signal,
  effect,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Sparkles,
  Wallet,
  Target,
  ChartColumnDecreasing,
  Settings,
  Compass,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  TrendingUp
} from 'lucide-angular';
import { TourService } from '../../../../core/services/tour/tour.service';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

interface PopoverPos {
  top: number;
  left: number;
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tour.isActive()) {
      <div
        class="fixed inset-0 z-[9998] overflow-hidden pointer-events-auto select-none"
        role="dialog"
        aria-modal="true"
        aria-label="Tour guiado"
      >
        <!-- SVG OVERLAY WITH CUTOUT SPOTLIGHT MASK -->
        <svg class="w-full h-full absolute inset-0 pointer-events-none">
          <defs>
            <mask id="tour-spotlight-mask">
              <!-- Fondo blanco cubre toda la pantalla -->
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <!-- Recorte negro sobre el elemento objetivo -->
              @if (spotlight()) {
                <rect
                  [attr.x]="spotlight()!.left"
                  [attr.y]="spotlight()!.top"
                  [attr.width]="spotlight()!.width"
                  [attr.height]="spotlight()!.height"
                  rx="16"
                  ry="16"
                  fill="black"
                  class="transition-all duration-200 ease-out"
                />
              }
            </mask>
          </defs>

          <!-- Fondo oscuro semi-translúcido con máscara aplicada -->
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(15, 23, 42, 0.78)"
            mask="url(#tour-spotlight-mask)"
          />
        </svg>

        <!-- ANILLO NEON HALO ALREDEDOR DEL TARGET -->
        @if (spotlight()) {
          <div
            class="absolute rounded-2xl pointer-events-none transition-all duration-200 ease-out z-10 border-2 border-emerald-400 dark:border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.45)] ring-2 ring-emerald-500/30"
            [style.top.px]="spotlight()!.top"
            [style.left.px]="spotlight()!.left"
            [style.width.px]="spotlight()!.width"
            [style.height.px]="spotlight()!.height"
          ></div>
        }

        <!-- POPOVER CARD FLOTANTE CON ALTO CONTRASTE -->
        <div
          #popoverRef
          class="absolute z-20 w-[380px] max-w-[calc(100vw-2rem)] transition-[top,left] duration-200 ease-out"
          [style.top.px]="popover().top"
          [style.left.px]="popover().left"
        >
          <div
            class="rounded-3xl border-2 border-emerald-500/40 dark:border-emerald-500/50 bg-white/98 dark:bg-slate-900/98 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 p-6 text-slate-900 dark:text-white"
          >
            <!-- HEADER -->
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-2.5">
                <!-- ICON BADGE -->
                <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                  <lucide-angular [img]="getStepIcon(tour.currentStep()?.iconName)" class="w-5 h-5 stroke-[2.2]"></lucide-angular>
                </div>

                <!-- STEP COUNTER PILL -->
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-500/30 tracking-wider uppercase">
                  Paso {{ tour.currentStepIndex() + 1 }} de {{ tour.totalSteps() }}
                </span>
              </div>

              <!-- CLOSE / SKIP (X) -->
              <button
                type="button"
                (click)="tour.skip()"
                class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar tour"
              >
                <lucide-angular [img]="X" class="w-4 h-4"></lucide-angular>
              </button>
            </div>

            <!-- TITLE & DESCRIPTION -->
            <div class="mb-5">
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {{ tour.currentStep()?.title }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2 font-normal">
                {{ tour.currentStep()?.description }}
              </p>
            </div>

            <!-- STEP PROGRESS BAR -->
            <div class="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
              <div
                class="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                [style.width.%]="tour.progressPercentage()"
              ></div>
            </div>

            <!-- FOOTER ACTIONS -->
            <div class="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                type="button"
                (click)="tour.skip()"
                class="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer px-2 py-1.5 rounded-lg"
              >
                Saltar tour
              </button>

              <div class="flex items-center gap-2">
                @if (!tour.isFirstStep()) {
                  <button
                    type="button"
                    (click)="tour.prev()"
                    class="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <lucide-angular [img]="ChevronLeft" class="w-3.5 h-3.5"></lucide-angular>
                    Atrás
                  </button>
                }

                <button
                  type="button"
                  (click)="tour.next()"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-500/25 transition-all cursor-pointer inline-flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  @if (tour.isLastStep()) {
                    <span>¡Finalizar!</span>
                    <lucide-angular [img]="Check" class="w-3.5 h-3.5 stroke-[2.5]"></lucide-angular>
                  } @else {
                    <span>Siguiente</span>
                    <lucide-angular [img]="ChevronRight" class="w-3.5 h-3.5 stroke-[2.5]"></lucide-angular>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class TourComponent {
  tour = inject(TourService);

  readonly X = X;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;
  readonly Check = Check;

  @ViewChild('popoverRef') popoverRef?: ElementRef<HTMLDivElement>;

  spotlight = signal<Rect | null>(null);
  popover = signal<PopoverPos>({ top: 100, left: 100, placement: 'center' });

  private rafId: number | null = null;

  constructor() {
    effect(() => {
      const active = this.tour.isActive();
      const step = this.tour.currentStep();

      if (active && step) {
        // Al cambiar de paso, esperamos a que el elemento exista y hacemos scroll solo 1 vez
        setTimeout(() => {
          this.handleStepChange();
        }, 60);
      } else {
        this.spotlight.set(null);
      }
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.tour.isActive()) return;
    this.requestPosUpdate();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.tour.isActive()) return;
    this.requestPosUpdate();
  }

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.tour.isActive()) return;

    if (event.key === 'ArrowRight' || event.key === 'Enter') {
      event.preventDefault();
      this.tour.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.tour.prev();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.tour.skip();
    }
  }

  getStepIcon(iconName?: string) {
    switch (iconName) {
      case 'sparkles': return Sparkles;
      case 'wallet': return Wallet;
      case 'target': return Target;
      case 'barChart': return ChartColumnDecreasing;
      case 'settings': return Settings;
      case 'compass': return Compass;
      case 'trendingUp': return TrendingUp;
      default: return Sparkles;
    }
  }

  private handleStepChange(retryCount = 0): void {
    const step = this.tour.currentStep();
    if (!step) return;

    const el = document.querySelector(step.targetSelector) as HTMLElement | null;
    if (el) {
      // ScrollIntoView se ejecuta ÚNICAMENTE al cambiar de paso, nunca en eventos scroll
      const b = el.getBoundingClientRect();
      const inView = b.top >= 80 && b.bottom <= (window.innerHeight - 80);
      if (!inView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        // Recalcular posición tras breve retardo para acompañar el scroll
        setTimeout(() => this.updatePositions(), 200);
      } else {
        this.updatePositions();
      }
    } else if (retryCount < 4) {
      // Reintentar si el elemento aún no ha renderizado en el DOM (p. ej. cambio de pestaña)
      setTimeout(() => this.handleStepChange(retryCount + 1), 80);
    } else {
      this.updatePositions();
    }
  }

  private requestPosUpdate(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.updatePositions();
    });
  }

  private updatePositions(): void {
    const step = this.tour.currentStep();
    if (!step) return;

    const el = document.querySelector(step.targetSelector) as HTMLElement | null;
    const padding = step.highlightPadding ?? 10;

    if (el) {
      const b = el.getBoundingClientRect();
      const rect: Rect = {
        top: Math.max(8, b.top - padding),
        left: Math.max(8, b.left - padding),
        width: b.width + padding * 2,
        height: b.height + padding * 2,
        bottom: b.bottom + padding,
        right: b.right + padding
      };

      this.spotlight.set(rect);
      this.computePopoverPos(rect, step.placement || 'auto');
    } else {
      this.spotlight.set(null);
      const width = 380;
      const height = 240;
      this.popover.set({
        top: Math.max(20, (window.innerHeight - height) / 2),
        left: Math.max(16, (window.innerWidth - width) / 2),
        placement: 'center'
      });
    }
  }

  private computePopoverPos(target: Rect, preferredPlacement: string): void {
    const popWidth = Math.min(380, window.innerWidth - 32);
    const popHeight = 240;
    const gap = 16;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let placement = preferredPlacement || 'bottom';
    let top = 0;
    let left = 0;

    const spaceBelow = vh - target.bottom - gap;
    const spaceAbove = target.top - gap;
    const spaceRight = vw - target.right - gap;
    const spaceLeft = target.left - gap;

    if (placement === 'bottom') {
      if (spaceBelow >= popHeight || spaceBelow >= spaceAbove) {
        top = target.bottom + gap;
      } else {
        placement = 'top';
        top = target.top - gap - popHeight;
      }
      left = target.left + (target.width / 2) - (popWidth / 2);
    } else if (placement === 'top') {
      if (spaceAbove >= popHeight || spaceAbove >= spaceBelow) {
        top = target.top - gap - popHeight;
      } else {
        placement = 'bottom';
        top = target.bottom + gap;
      }
      left = target.left + (target.width / 2) - (popWidth / 2);
    } else if (placement === 'right') {
      if (spaceRight >= popWidth || spaceRight >= spaceLeft) {
        left = target.right + gap;
        top = target.top + (target.height / 2) - (popHeight / 2);
      } else if (spaceLeft >= popWidth) {
        placement = 'left';
        left = target.left - gap - popWidth;
        top = target.top + (target.height / 2) - (popHeight / 2);
      } else {
        placement = 'bottom';
        top = target.bottom + gap;
        left = target.left + (target.width / 2) - (popWidth / 2);
      }
    } else if (placement === 'left') {
      if (spaceLeft >= popWidth || spaceLeft >= spaceRight) {
        left = target.left - gap - popWidth;
        top = target.top + (target.height / 2) - (popHeight / 2);
      } else if (spaceRight >= popWidth) {
        placement = 'right';
        left = target.right + gap;
        top = target.top + (target.height / 2) - (popHeight / 2);
      } else {
        placement = 'bottom';
        top = target.bottom + gap;
        left = target.left + (target.width / 2) - (popWidth / 2);
      }
    } else {
      if (spaceBelow >= popHeight) {
        placement = 'bottom';
        top = target.bottom + gap;
        left = target.left + (target.width / 2) - (popWidth / 2);
      } else if (spaceAbove >= popHeight) {
        placement = 'top';
        top = target.top - gap - popHeight;
        left = target.left + (target.width / 2) - (popWidth / 2);
      } else {
        placement = 'bottom';
        top = Math.max(16, vh - popHeight - 16);
        left = target.left + (target.width / 2) - (popWidth / 2);
      }
    }

    // Clamping estricto para no desbordar viewport
    left = Math.max(16, Math.min(left, vw - popWidth - 16));
    top = Math.max(16, Math.min(top, vh - popHeight - 16));

    this.popover.set({
      top: Math.round(top),
      left: Math.round(left),
      placement: placement as any
    });
  }
}
