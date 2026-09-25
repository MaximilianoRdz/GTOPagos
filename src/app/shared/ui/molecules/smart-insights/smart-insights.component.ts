import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sparkles, AlertTriangle, TrendingUp, TrendingDown, ShieldCheck, ArrowRight, X, ChevronLeft, ChevronRight, Layers } from 'lucide-angular';

export interface SmartInsight {
  id: string;
  type: 'warning' | 'danger' | 'info' | 'success';
  title: string;
  description: string;
  badge: string;
  icon: any;
  actionLabel?: string;
  actionRoute?: string;
  actionType?: 'route' | 'upcoming-modal';
}

@Component({
  selector: 'app-smart-insights',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    @if (currentInsight) {
      <div 
        class="relative overflow-hidden rounded-2xl border p-5 sm:p-6 shadow-sm transition-all duration-300"
        [ngClass]="getCardClasses(currentInsight.type)"
      >
        <!-- Background Ambient Glow -->
        <div 
          class="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors"
          [ngClass]="getGlowClasses(currentInsight.type)"
        ></div>

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- Left side: Icon + Content -->
          <div class="flex items-start gap-4 flex-1">
            <div 
              class="p-3 rounded-2xl shrink-0 shadow-xs flex items-center justify-center transition-colors"
              [ngClass]="getIconContainerClasses(currentInsight.type)"
            >
              <lucide-angular [img]="currentInsight.icon" class="w-6 h-6"></lucide-angular>
            </div>

            <div class="space-y-1.5 flex-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span 
                  class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-2xs"
                  [ngClass]="getBadgeClasses(currentInsight.type)"
                >
                  <lucide-angular [img]="Sparkles" class="w-3 h-3"></lucide-angular>
                  <span>{{ currentInsight.badge }}</span>
                </span>

                @if (insights().length > 1) {
                  <span class="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {{ activeIndex() + 1 }} de {{ insights().length }}
                  </span>
                }
              </div>

              <h4 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {{ currentInsight.title }}
              </h4>

              <p class="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                {{ currentInsight.description }}
              </p>
            </div>
          </div>

          <!-- Right side: Actions & Carousel Nav -->
          <div class="flex items-center gap-2.5 self-end md:self-center shrink-0">
            @if (currentInsight.actionLabel) {
              <button
                type="button"
                (click)="handleAction(currentInsight)"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
                [ngClass]="getActionButtonClasses(currentInsight.type)"
              >
                <span>{{ currentInsight.actionLabel }}</span>
                <lucide-angular [img]="ArrowRight" class="w-4 h-4"></lucide-angular>
              </button>
            }

            <!-- Navigation between multiple insights -->
            @if (insights().length > 1) {
              <div class="flex items-center gap-1 border-l border-slate-200/80 dark:border-slate-800 pl-2 ml-1">
                <button
                  type="button"
                  (click)="prevInsight()"
                  title="Insight anterior"
                  class="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  <lucide-angular [img]="ChevronLeft" class="w-4 h-4"></lucide-angular>
                </button>
                <button
                  type="button"
                  (click)="nextInsight()"
                  title="Siguiente insight"
                  class="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  <lucide-angular [img]="ChevronRight" class="w-4 h-4"></lucide-angular>
                </button>
              </div>
            }

            <!-- Dismiss button -->
            <button
              type="button"
              (click)="dismissInsight(currentInsight.id)"
              title="Descartar este insight"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/5 transition cursor-pointer ml-0.5"
            >
              <lucide-angular [img]="X" class="w-4 h-4"></lucide-angular>
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class SmartInsightsComponent implements OnInit, OnChanges {
  readonly Sparkles = Sparkles;
  readonly ArrowRight = ArrowRight;
  readonly X = X;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  @Input() totalIncome = 0;
  @Input() totalExpenses = 0;
  @Input() budgetLimit = 0;
  @Input() budgetDaysLeft = 0;
  @Input() upcomingDueCount = 0;
  @Input() upcomingDueRecords: any[] = [];
  @Input() rawCategoryData: { labels: string[]; data: number[] } = { labels: [], data: [] };
  @Input() netWorth = 0;

  @Output() openUpcomingDueModal = new EventEmitter<void>();
  @Output() navigateRoute = new EventEmitter<string>();

  insights = signal<SmartInsight[]>([]);
  activeIndex = signal<number>(0);
  dismissedIds = new Set<string>();

  get currentInsight(): SmartInsight | null {
    const list = this.insights();
    if (list.length === 0) return null;
    const idx = Math.min(this.activeIndex(), list.length - 1);
    return list[idx] || null;
  }

  ngOnInit(): void {
    this.loadDismissedInsights();
    this.computeInsights();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.computeInsights();
  }

  computeInsights(): void {
    const generated: SmartInsight[] = [];

    // 1. Compromisos y cuotas MSI próximas a vencer (ALERTA CRÍTICA)
    if (this.upcomingDueCount > 0) {
      const totalDue = this.upcomingDueRecords.reduce((sum, r) => sum + Number(r.amount || 0), 0);
      const isMultiple = this.upcomingDueCount > 1;
      generated.push({
        id: 'upcoming-due',
        type: 'danger',
        badge: 'Compromiso Próximo',
        icon: AlertTriangle,
        title: `${this.upcomingDueCount} pago${isMultiple ? 's' : ''} pendiente${isMultiple ? 's' : ''} por vencer`,
        description: `Tienes ${this.formatCurrency(totalDue)} comprometidos en tus cuentas o tarjetas. Recuerda liquidarlos a tiempo para mantener tus finanzas sanas.`,
        actionLabel: 'Ver pagos pendientes',
        actionType: 'upcoming-modal',
      });
    }

    // 2. Velocidad de Consumo de Presupuesto (Burn Rate)
    const effectiveBudget = this.budgetLimit > 0 ? this.budgetLimit : (this.totalIncome > 0 ? this.totalIncome : 0);
    if (effectiveBudget > 0 && this.totalExpenses > 0) {
      const today = new Date();
      const totalDaysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const elapsedDays = Math.max(1, totalDaysInMonth - Math.max(0, this.budgetDaysLeft));
      const pctTime = Math.min(100, Math.round((elapsedDays / totalDaysInMonth) * 100));
      const pctSpent = Math.round((this.totalExpenses / effectiveBudget) * 100);

      if (pctSpent >= 65 && pctSpent > (pctTime + 12)) {
        generated.push({
          id: 'burn-rate-high',
          type: 'warning',
          badge: 'Ritmo Acelerado',
          icon: TrendingDown,
          title: 'Velocidad de gasto por encima de la media',
          description: `Has consumido el ${pctSpent}% de tu presupuesto estimado con el ${pctTime}% del período transcurrido. Modera consumos discrecionales para llegar con holgura al corte.`,
          actionLabel: 'Gestionar presupuesto',
          actionRoute: '/budgets',
          actionType: 'route',
        });
      } else if (pctSpent <= 45 && pctTime >= 50) {
        generated.push({
          id: 'burn-rate-healthy',
          type: 'success',
          badge: 'Excelente Control',
          icon: ShieldCheck,
          title: 'Gasto disciplinado y bajo control',
          description: `Llevas consumido el ${pctSpent}% del presupuesto al ${pctTime}% del período. Tu ritmo actual te permitirá cerrar con un margen positivo de ahorro.`,
          actionLabel: 'Ver reportes',
          actionRoute: '/reports',
          actionType: 'route',
        });
      }
    }

    // 3. Concentración de Gasto en Categoría Específica
    if (this.rawCategoryData?.data?.length > 0 && this.totalExpenses > 0) {
      let maxVal = 0;
      let maxIdx = 0;
      this.rawCategoryData.data.forEach((val, i) => {
        if (val > maxVal) {
          maxVal = val;
          maxIdx = i;
        }
      });

      const pctCat = Math.round((maxVal / this.totalExpenses) * 100);
      const catName = this.rawCategoryData.labels[maxIdx] || 'Categoría Principal';

      if (pctCat >= 40 && maxVal > 0) {
        generated.push({
          id: `category-concentration-${catName.toLowerCase().replace(/\\s+/g, '-')}`,
          type: 'info',
          badge: 'Análisis de Gastos',
          icon: Layers,
          title: `Foco de egreso: ${catName}`,
          description: `El ${pctCat}% de tus egresos (${this.formatCurrency(maxVal)}) se concentra en "${catName}". Mantener bajo lupa esta categoría te dará mayor liquidez.`,
          actionLabel: 'Explorar categorías',
          actionRoute: '/reports',
          actionType: 'route',
        });
      }
    }

    // 4. Superávit y Capacidad de Ahorro para Metas
    if (this.totalIncome > 0 && this.totalIncome > this.totalExpenses) {
      const superavit = this.totalIncome - this.totalExpenses;
      const marginPct = Math.round((superavit / this.totalIncome) * 100);

      if (marginPct >= 10 && superavit >= 500) {
        generated.push({
          id: 'savings-surplus',
          type: 'success',
          badge: 'Oportunidad de Ahorro',
          icon: TrendingUp,
          title: `Superávit estimado: ${this.formatCurrency(superavit)}`,
          description: `Cuentas con un margen a favor del ${marginPct}% de tus ingresos en este período. Es un excelente momento para apartar un abono a tus metas financieras.`,
          actionLabel: 'Abonar a mis metas',
          actionRoute: '/goals',
          actionType: 'route',
        });
      }
    }

    // 5. Diagnóstico General Positivo (Fallback si todo está al día)
    if (generated.length === 0) {
      generated.push({
        id: 'healthy-all-clear',
        type: 'info',
        badge: 'Diagnóstico en Tiempo Real',
        icon: Sparkles,
        title: 'Finanzas equilibradas y sin alertas críticas',
        description: 'Tus indicadores financieros se encuentran en orden. Puedes apoyarte en el Asistente IA para proyecciones o registrar nuevos movimientos cuando lo requieras.',
        actionLabel: 'Explorar presupuestos',
        actionRoute: '/budgets',
        actionType: 'route',
      });
    }

    // Filtrar insights descartados en la sesión actual
    const filtered = generated.filter(i => !this.dismissedIds.has(i.id));
    this.insights.set(filtered);

    // Ajustar activeIndex si excede la longitud
    if (this.activeIndex() >= filtered.length) {
      this.activeIndex.set(Math.max(0, filtered.length - 1));
    }
  }

  nextInsight(): void {
    const total = this.insights().length;
    if (total > 1) {
      this.activeIndex.update(i => (i + 1) % total);
    }
  }

  prevInsight(): void {
    const total = this.insights().length;
    if (total > 1) {
      this.activeIndex.update(i => (i - 1 + total) % total);
    }
  }

  dismissInsight(id: string): void {
    this.dismissedIds.add(id);
    this.saveDismissedInsights();
    const remaining = this.insights().filter(i => i.id !== id);
    this.insights.set(remaining);
    if (this.activeIndex() >= remaining.length) {
      this.activeIndex.set(Math.max(0, remaining.length - 1));
    }
  }

  handleAction(insight: SmartInsight): void {
    if (insight.actionType === 'upcoming-modal') {
      this.openUpcomingDueModal.emit();
    } else if (insight.actionRoute) {
      this.navigateRoute.emit(insight.actionRoute);
    }
  }

  private loadDismissedInsights(): void {
    try {
      const stored = sessionStorage.getItem('gtopagos_dismissed_insights');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.dismissedIds = new Set(parsed);
        }
      }
    } catch {
      // Ignorar fallos de parsing de sesión
    }
  }

  private saveDismissedInsights(): void {
    try {
      sessionStorage.setItem('gtopagos_dismissed_insights', JSON.stringify(Array.from(this.dismissedIds)));
    } catch {
      // Ignorar fallos de almacenamiento
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  getCardClasses(type: SmartInsight['type']): string {
    switch (type) {
      case 'danger':
        return 'bg-gradient-to-r from-red-50/90 via-rose-50/50 to-white dark:from-red-950/30 dark:via-slate-900 dark:to-slate-900 border-red-200/80 dark:border-red-900/40';
      case 'warning':
        return 'bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-white dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-amber-200/80 dark:border-amber-900/40';
      case 'success':
        return 'bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-900 border-emerald-200/80 dark:border-emerald-900/40';
      case 'info':
      default:
        return 'bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900 border-indigo-200/80 dark:border-indigo-900/40';
    }
  }

  getGlowClasses(type: SmartInsight['type']): string {
    switch (type) {
      case 'danger': return 'bg-rose-500';
      case 'warning': return 'bg-amber-500';
      case 'success': return 'bg-emerald-500';
      case 'info':
      default: return 'bg-indigo-500';
    }
  }

  getIconContainerClasses(type: SmartInsight['type']): string {
    switch (type) {
      case 'danger': return 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
      case 'warning': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      case 'success': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'info':
      default: return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800';
    }
  }

  getBadgeClasses(type: SmartInsight['type']): string {
    switch (type) {
      case 'danger': return 'bg-rose-100/90 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
      case 'warning': return 'bg-amber-100/90 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200 dark:border-amber-800';
      case 'success': return 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
      case 'info':
      default: return 'bg-indigo-100/90 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
    }
  }

  getActionButtonClasses(type: SmartInsight['type']): string {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20';
      case 'info':
      default:
        return 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20';
    }
  }
}
