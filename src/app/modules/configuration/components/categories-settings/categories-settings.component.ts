import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Trash2, Tags, X } from 'lucide-angular';
import { Category, FinancialRecordType } from '../../../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-categories-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block w-full'
  },
  template: `
    <div class="flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Gestión de Categorías
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Crea tus propias categorías para organizar tus gastos e ingresos a tu medida.
          </p>
        </div>

        <button
          type="button"
          (click)="openModal()"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors cursor-pointer w-fit"
        >
          <lucide-angular [img]="Plus" class="w-4 h-4"></lucide-angular>
          <span>Nueva categoría</span>
        </button>
      </div>

      <!-- Filtros por tipo -->
      <div class="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
        <button
          type="button"
          (click)="categoryFilter = 'all'"
          [class]="'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ' +
          (categoryFilter === 'all' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400')"
        >
          Todas ({{ categories.length }})
        </button>
        <button
          type="button"
          (click)="categoryFilter = 'expense'"
          [class]="'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ' +
          (categoryFilter === 'expense' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400')"
        >
          Gastos ({{ expenseCount }})
        </button>
        <button
          type="button"
          (click)="categoryFilter = 'income'"
          [class]="'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ' +
          (categoryFilter === 'income' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400')"
        >
          Ingresos ({{ incomeCount }})
        </button>
      </div>

      <!-- Lista de Categorías -->
      @if (loading) {
        <div class="py-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          Cargando categorías...
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          @for (cat of filteredCategories; track cat.id) {
            <div class="p-3.5 rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-white/40 dark:bg-slate-800/40 hover:border-emerald-300 dark:hover:border-emerald-700/50 transition-all flex items-center justify-between group">
              <div class="flex items-center gap-3 min-w-0">
                <div [class]="'w-3.5 h-3.5 rounded-full shrink-0 ' + (cat.color || 'bg-slate-400')"></div>
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {{ cat.name }}
                  </p>
                  <div class="flex items-center gap-1.5 mt-0.5">
                    @if (cat.is_custom) {
                      <span class="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        Personalizada
                      </span>
                    } @else {
                      <span class="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                        Sistema
                      </span>
                    }
                  </div>
                </div>
              </div>

              @if (cat.is_custom) {
                <button
                  type="button"
                  (click)="deleteCategory.emit(cat)"
                  title="Eliminar categoría"
                  class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors cursor-pointer"
                >
                  <lucide-angular [img]="Trash2" class="w-4 h-4"></lucide-angular>
                </button>
              }
            </div>
          }
        </div>
      }
    </div>

    <!-- Modal Nueva Categoría -->
    @if (showNewCategoryModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
        <div class="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <lucide-angular [img]="Tags" class="w-5 h-5"></lucide-angular>
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900 dark:text-white">Nueva Categoría</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400">Crea una categoría para tus movimientos</p>
              </div>
            </div>

            <button
              type="button"
              (click)="closeModal()"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <lucide-angular [img]="X" class="w-5 h-5"></lucide-angular>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Nombre</label>
              <input
                type="text"
                [(ngModel)]="newCategory.name"
                placeholder="Ej. Gimnasio, Cursos, Mascotas"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Tipo de movimiento</label>
              <select
                [(ngModel)]="newCategory.record_type_id"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white text-sm outline-none focus:border-emerald-500"
              >
                @for (type of recordTypes; track type.id) {
                  <option [value]="type.id">{{ type.name }}</option>
                }
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Color identificador</label>
              <div class="flex items-center gap-2 flex-wrap">
                @for (color of colorOptions; track color.class) {
                  <button
                    type="button"
                    (click)="newCategory.color = color.class"
                    [class]="'w-7 h-7 rounded-full transition-transform cursor-pointer ' + color.class + (newCategory.color === color.class ? ' ring-2 ring-offset-2 ring-emerald-500 scale-110' : ' hover:scale-105')"
                    [title]="color.name"
                  ></button>
                }
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 p-5 border-t border-gray-100 dark:border-slate-800">
            <button
              type="button"
              (click)="closeModal()"
              class="px-4 py-2 text-sm font-semibold rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              (click)="submitCategory()"
              [disabled]="creatingCategory"
              class="px-5 py-2 text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {{ creatingCategory ? 'Guardando...' : 'Crear categoría' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class CategoriesSettingsComponent {
  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly Tags = Tags;
  readonly X = X;

  @Input() categories: Category[] = [];
  @Input() recordTypes: FinancialRecordType[] = [];
  @Input() loading = false;
  @Input() creatingCategory = false;

  @Output() createCategory = new EventEmitter<{ name: string; record_type_id: number; color: string }>();
  @Output() deleteCategory = new EventEmitter<Category>();
  @Output() validationError = new EventEmitter<string>();

  categoryFilter: 'all' | 'expense' | 'income' = 'all';
  @Input() showNewCategoryModal = false;
  @Output() showNewCategoryModalChange = new EventEmitter<boolean>();

  newCategory = {
    name: '',
    record_type_id: 1,
    color: 'bg-emerald-500',
  };

  colorOptions = [
    { name: 'Esmeralda', class: 'bg-emerald-500' },
    { name: 'Azul', class: 'bg-blue-500' },
    { name: 'Indigo', class: 'bg-indigo-500' },
    { name: 'Morado', class: 'bg-purple-500' },
    { name: 'Rosa', class: 'bg-rose-500' },
    { name: 'Ámbar', class: 'bg-amber-500' },
    { name: 'Rojo', class: 'bg-red-500' },
    { name: 'Teal', class: 'bg-teal-500' },
  ];

  private isCategoryOfBehavior(c: Category, targetBehavior: 'expense' | 'income'): boolean {
    const catBehavior = ((c as any).record_type_behavior || '').toLowerCase();
    if (catBehavior) {
      return catBehavior === targetBehavior;
    }
    const targetType = this.recordTypes.find(t => {
      const b = (t.behavior || '').toLowerCase();
      const n = (t.name || '').toLowerCase();
      return b === targetBehavior || n === targetBehavior;
    });
    if (targetType) {
      return Number(c.record_type_id) === Number(targetType.id);
    }
    return targetBehavior === 'expense' ? Number(c.record_type_id) === 1 : Number(c.record_type_id) === 2;
  }

  get expenseCount(): number {
    return this.categories.filter(c => this.isCategoryOfBehavior(c, 'expense')).length;
  }

  get incomeCount(): number {
    return this.categories.filter(c => this.isCategoryOfBehavior(c, 'income')).length;
  }

  get filteredCategories(): Category[] {
    const filter = this.categoryFilter;
    if (filter === 'all') return this.categories;
    return this.categories.filter(c => this.isCategoryOfBehavior(c, filter));
  }

  openModal(): void {
    if (this.recordTypes.length && !this.newCategory.record_type_id) {
      this.newCategory.record_type_id = this.recordTypes[0].id;
    }
    this.showNewCategoryModal = true;
    this.showNewCategoryModalChange.emit(true);
  }

  closeModal(): void {
    this.showNewCategoryModal = false;
    this.showNewCategoryModalChange.emit(false);
    this.newCategory.name = '';
  }

  submitCategory(): void {
    if (!this.newCategory.name.trim()) {
      this.validationError.emit('Por favor ingresa el nombre de la categoría');
      return;
    }

    this.createCategory.emit({
      name: this.newCategory.name.trim(),
      record_type_id: Number(this.newCategory.record_type_id) || 1,
      color: this.newCategory.color,
    });
  }
}
