import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Shield, Eye, EyeOff, Save } from 'lucide-angular';
import { AlertBannerComponent } from '../../../../shared/ui/molecules/alert-banner/alert-banner.component';

export interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: 'app-security-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, AlertBannerComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block w-full'
  },
  template: `
    <div class="flex flex-col gap-6">
      <!-- Aviso de seguridad con AlertBanner Component -->
      <app-alert-banner
        variant="warning"
        [icon]="Shield"
        title="Seguridad de la cuenta"
        description="Mantén tu cuenta segura actualizando regularmente tu contraseña."
      />

      <!-- Campos -->
      <div class="space-y-4">
        <!-- Contraseña actual -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contraseña actual
          </label>
          <div class="relative">
            <input
              [type]="showCurrentPassword ? 'text' : 'password'"
              [(ngModel)]="data.currentPassword"
              class="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Ingresa tu contraseña actual"
            />
            <button
              type="button"
              (click)="showCurrentPassword = !showCurrentPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <lucide-angular [img]="showCurrentPassword ? EyeOff : Eye" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        </div>

        <!-- Nueva contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nueva contraseña
          </label>
          <div class="relative">
            <input
              [type]="showNewPassword ? 'text' : 'password'"
              [(ngModel)]="data.newPassword"
              class="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Ingresa tu nueva contraseña"
            />
            <button
              type="button"
              (click)="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <lucide-angular [img]="showNewPassword ? EyeOff : Eye" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        </div>

        <!-- Confirmar contraseña -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmar nueva contraseña
          </label>
          <div class="relative">
            <input
              [type]="showConfirmPassword ? 'text' : 'password'"
              [(ngModel)]="data.confirmPassword"
              class="w-full pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
              placeholder="Confirma tu nueva contraseña"
            />
            <button
              type="button"
              (click)="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
            >
              <lucide-angular [img]="showConfirmPassword ? EyeOff : Eye" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        </div>
      </div>

      <!-- Guardar -->
      <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
        <button
          type="button"
          (click)="save.emit(data)"
          [disabled]="loading"
          class="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer font-semibold disabled:opacity-60"
        >
          <lucide-angular [img]="Save" class="w-4 h-4"></lucide-angular>
          <span>{{ loading ? 'Actualizando...' : 'Actualizar datos' }}</span>
        </button>
      </div>
    </div>
  `,
})
export class SecuritySettingsComponent {
  readonly Shield = Shield;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Save = Save;

  @Input() loading = false;
  @Output() save = new EventEmitter<SecurityData>();

  data: SecurityData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
}
