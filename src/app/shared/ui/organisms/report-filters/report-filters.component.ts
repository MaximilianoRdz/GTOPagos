import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, FileText, Download, Search, ChevronDown } from 'lucide-angular';
import { UserFinanceDashboard } from '../../../models';

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block w-full'
  },
  template: `
    <div class="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-sm p-6 border border-gray-100 dark:border-slate-800">
      <!-- Header with title & export buttons -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/80">
        <div class="flex items-center gap-3.5">
          <div class="p-3 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl text-white shadow-md shadow-emerald-500/20 flex items-center justify-center">
            <lucide-angular [img]="FileText" class="w-6 h-6"></lucide-angular>
          </div>
          <div>
            <h2 class="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Generador de Reportes</h2>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">Consulta y exporta tus movimientos financieros por mes</p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            (click)="downloadPdf.emit()"
            [disabled]="!canDownload"
            title="Exportar a PDF"
            class="flex items-center justify-center gap-2 px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 border border-red-200/80 dark:border-red-900/60 rounded-xl transition-all font-bold text-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <lucide-angular [img]="Download" class="w-3.5 h-3.5"></lucide-angular>
            <span>PDF</span>
          </button>
          <button
            type="button"
            (click)="downloadExcel.emit()"
            [disabled]="!canDownload"
            title="Exportar a Excel"
            class="flex items-center justify-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900/60 rounded-xl transition-all font-bold text-xs shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <lucide-angular [img]="Download" class="w-3.5 h-3.5"></lucide-angular>
            <span>Excel</span>
          </button>
        </div>
      </div>

      <!-- Filters Row: Cuenta, Mes, Año y Botón Consultar -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
        <!-- Cuenta / Dashboard: 5 columns on desktop -->
        <div class="sm:col-span-2 lg:col-span-5">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 select-none leading-none">
            Cuenta / Dashboard
          </label>
          <div class="relative">
            <select
              [ngModel]="selectedDashboardId"
              (ngModelChange)="onDashboardChange($event)"
              class="w-full h-11 py-2.5 pl-3.5 pr-9 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-semibold leading-normal focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer appearance-none truncate"
            >
              @for (d of dashboards; track d.id) {
                <option [value]="d.id" class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1 font-medium">{{ d.name }}</option>
              }
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500">
              <lucide-angular [img]="ChevronDown" class="w-4 h-4"></lucide-angular>
            </div>
          </div>
        </div>

        <!-- Mes: 3 columns on desktop -->
        <div class="sm:col-span-1 lg:col-span-3">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 select-none leading-none">
            Mes
          </label>
          <div class="relative">
            <select
              [ngModel]="selectedMonth"
              (ngModelChange)="onMonthChange($event)"
              class="w-full h-11 py-2.5 pl-3.5 pr-9 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-semibold leading-normal focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer appearance-none"
            >
              @for (m of months; track m.value) {
                <option [value]="m.value" class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1 font-medium">{{ m.name }}</option>
              }
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500">
              <lucide-angular [img]="ChevronDown" class="w-4 h-4"></lucide-angular>
            </div>
          </div>
        </div>

        <!-- Año: 2 columns on desktop -->
        <div class="sm:col-span-1 lg:col-span-2">
          <label class="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 select-none leading-none">
            Año
          </label>
          <div class="relative">
            <select
              [ngModel]="selectedYear"
              (ngModelChange)="onYearChange($event)"
              class="w-full h-11 py-2.5 pl-3.5 pr-9 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-800 dark:text-slate-100 text-sm font-semibold leading-normal focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all cursor-pointer appearance-none"
            >
              @for (y of years; track y) {
                <option [value]="y" class="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 py-1 font-medium">{{ y }}</option>
              }
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500">
              <lucide-angular [img]="ChevronDown" class="w-4 h-4"></lucide-angular>
            </div>
          </div>
        </div>

        <!-- Botón Consultar: 2 columns on desktop -->
        <div class="sm:col-span-2 lg:col-span-2">
          <button
            type="button"
            (click)="generate.emit()"
            [disabled]="isLoading"
            class="w-full h-11 flex items-center justify-center gap-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all font-bold text-sm shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            @if (!isLoading) {
              <lucide-angular [img]="Search" class="w-4 h-4"></lucide-angular>
            } @else {
              <span class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            }
            <span>Consultar</span>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ReportFiltersComponent implements OnInit, OnChanges {
  readonly FileText = FileText;
  readonly Download = Download;
  readonly Search = Search;
  readonly ChevronDown = ChevronDown;

  @Input() dashboards: UserFinanceDashboard[] = [];
  @Input() selectedDashboardId: number | null = null;
  @Input() startDate: string = '';
  @Input() endDate: string = '';
  @Input() isLoading: boolean = false;
  @Input() canDownload: boolean = false;

  @Output() selectedDashboardIdChange = new EventEmitter<number | null>();
  @Output() startDateChange = new EventEmitter<string>();
  @Output() endDateChange = new EventEmitter<string>();
  @Output() generate = new EventEmitter<void>();
  @Output() downloadPdf = new EventEmitter<void>();
  @Output() downloadExcel = new EventEmitter<void>();

  readonly months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' },
  ];

  years: number[] = [];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

    this.parseInitialDates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['startDate'] && this.startDate) {
      this.parseInitialDates();
    }
  }

  private parseInitialDates(): void {
    if (!this.startDate) {
      this.emitDates();
      return;
    }
    const parts = this.startDate.split('-');
    if (parts.length >= 2) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      if (!isNaN(y) && !isNaN(m)) {
        this.selectedYear = y;
        this.selectedMonth = m;
        if (!this.years.includes(y)) {
          this.years.push(y);
          this.years.sort((a, b) => b - a);
        }
      }
    }
  }

  onDashboardChange(val: any): void {
    const num = val ? Number(val) : null;
    this.selectedDashboardIdChange.emit(num);
  }

  onMonthChange(m: any): void {
    this.selectedMonth = Number(m);
    this.emitDates();
  }

  onYearChange(y: any): void {
    this.selectedYear = Number(y);
    this.emitDates();
  }

  private emitDates(): void {
    const y = this.selectedYear;
    const m = this.selectedMonth;
    // Last day of month m in year y
    const lastDay = new Date(y, m, 0).getDate();
    const mm = String(m).padStart(2, '0');
    const dd = String(lastDay).padStart(2, '0');

    const start = `${y}-${mm}-01`;
    const end = `${y}-${mm}-${dd}`;

    this.startDateChange.emit(start);
    this.endDateChange.emit(end);
  }
}
