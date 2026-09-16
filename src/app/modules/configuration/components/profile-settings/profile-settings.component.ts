import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Phone, Save } from 'lucide-angular';

export interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Información Personal
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm">
          Actualiza tu información personal básica
        </p>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
          <input
            type="text"
            [(ngModel)]="data.firstName"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          />
        </div>

        <!-- Apellido -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Apellido</label>
          <input
            type="text"
            [(ngModel)]="data.lastName"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
          />
        </div>

        <!-- Teléfono -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Teléfono</label>
          <div class="relative">
            <lucide-angular [img]="Phone" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"></lucide-angular>
            <input
              type="tel"
              placeholder="834 123 4567"
              [(ngModel)]="data.phone"
              (ngModelChange)="formatPhone($event)"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-800">
        <button
          type="button"
          (click)="save.emit(data)"
          [disabled]="loading"
          class="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer font-semibold disabled:opacity-60"
        >
          <lucide-angular [img]="Save" class="w-4 h-4"></lucide-angular>
          <span>{{ loading ? 'Guardando...' : 'Guardar cambios' }}</span>
        </button>
      </div>
    </div>
  `,
})
export class ProfileSettingsComponent {
  readonly Phone = Phone;
  readonly Save = Save;

  @Input({ required: true }) data!: ProfileData;
  @Input() loading = false;

  @Output() save = new EventEmitter<ProfileData>();

  formatPhone(value: string): void {
    if (!value) return;
    let cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);

    let formatted = '';
    if (cleaned.length > 6) {
      formatted = `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
    } else if (cleaned.length > 3) {
      formatted = `${cleaned.substring(0, 3)} ${cleaned.substring(3)}`;
    } else {
      formatted = cleaned;
    }

    this.data.phone = formatted;
  }
}
