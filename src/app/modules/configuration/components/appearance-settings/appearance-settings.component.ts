import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sun, Moon, Monitor, Palette, Sparkles } from 'lucide-angular';

export type AppTheme = 'light' | 'dark' | 'auto';

@Component({
  selector: 'app-appearance-settings',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Título -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Apariencia
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Personaliza la apariencia y el tema visual de tu aplicación
        </p>
      </div>

      <!-- Selector de tema -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tema de la interfaz
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          @for (option of themeOptions; track option.value) {
            <button
              type="button"
              (click)="themeChange.emit(option.value)"
              class="p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer"
              [ngClass]="
                currentTheme === option.value
                  ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/20 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-slate-800/40'
              "
            >
              <div class="flex items-center gap-3">
                <div
                  class="p-2.5 rounded-xl"
                  [ngClass]="currentTheme === option.value ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'"
                >
                  <lucide-angular [img]="option.icon" class="w-5 h-5"></lucide-angular>
                </div>
                <div>
                  <p
                    class="font-semibold text-sm"
                    [ngClass]="currentTheme === option.value ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'"
                  >
                    {{ option.label }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {{ option.description }}
                  </p>
                </div>
              </div>
            </button>
          }
        </div>
      </div>

      <!-- Tour interactivo del sistema -->
      <div class="pt-6 border-t border-gray-200 dark:border-slate-800">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
              Tour interactivo de bienvenida
            </h4>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-lg">
              Vuelve a recorrer la guía interactiva paso a paso para familiarizarte con las secciones y herramientas de GTOPagos.
            </p>
          </div>
          <button
            type="button"
            (click)="restartTour.emit()"
            class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all cursor-pointer shadow-xs active:scale-98 shrink-0"
          >
            <lucide-angular [img]="Sparkles" class="w-4 h-4 text-emerald-600 dark:text-emerald-400"></lucide-angular>
            <span>Reiniciar tour</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AppearanceSettingsComponent {
  readonly Palette = Palette;
  readonly Sparkles = Sparkles;

  @Input() currentTheme: AppTheme = 'auto';

  @Output() themeChange = new EventEmitter<AppTheme>();
  @Output() restartTour = new EventEmitter<void>();

  themeOptions = [
    {
      value: 'light' as const,
      label: 'Claro',
      icon: Sun,
      description: 'Colores limpios y luminosos',
    },
    {
      value: 'dark' as const,
      label: 'Oscuro',
      icon: Moon,
      description: 'Ideal para la noche y menor fatiga visual',
    },
    {
      value: 'auto' as const,
      label: 'Automático',
      icon: Monitor,
      description: 'Se ajusta al tema de tu sistema',
    },
  ];
}
