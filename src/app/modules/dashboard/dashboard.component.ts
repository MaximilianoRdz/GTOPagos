import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Wallet, TrendingUp, TrendingDown, Target, ChartColumnDecreasing, Calendar, Settings, ShoppingCart, Film, Coffee, Briefcase, Code, AlertTriangle, Bell, CheckCircle, Sparkles, BarChart3, PieChart, Receipt } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { SHARED_IMPORTS } from '../../shared/shared.config';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { AlertsService } from '../../core/services/alerts/Alerts.service';
import { TourService } from '../../core/services/tour/tour.service';
import { forkJoin, catchError, of } from 'rxjs';
import { ConfigurationService } from '../../core/services/configuration/configuration.service';

interface Stat {
  icon: any;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
  isNegative?: boolean;
}

interface Transaction {
  id: number;
  description: string;
  date: string;
  amount: string;
  type: 'income' | 'expense';
  categoryIcon: any;
  categoryColor: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [...SHARED_IMPORTS, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly Wallet = Wallet;
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly Target = Target;
  readonly ChartColumnDecreasing = ChartColumnDecreasing;
  readonly Calendar = Calendar;
  readonly Settings = Settings;
  readonly ShoppingCart = ShoppingCart;
  readonly Film = Film;
  readonly Coffee = Coffee;
  readonly Briefcase = Briefcase;
  readonly Code = Code;
  readonly AlertTriangle = AlertTriangle;
  readonly Bell = Bell;
  readonly CheckCircle = CheckCircle;
  readonly Sparkles = Sparkles;
  readonly BarChart3 = BarChart3;
  readonly PieChart = PieChart;
  readonly Receipt = Receipt;

  startTour(): void {
    this.tourService.start('dashboard', true);
  }

  // Due Payments Alert
  upcomingDueRecords: any[] = [];
  upcomingDueCount: number = 0;
  showUpcomingDueModal: boolean = false;
  payingRecordId: number | null = null;

  // Chart Data
  categoryChartData: any;
  categoryChartOptions: any;
  monthlyChartData: any;
  monthlyChartOptions: any;

  private rawMonthlyDashboards: any[] = [];
  private rawCategoryData: { labels: string[]; data: number[] } = { labels: [], data: [] };
  private themeObserver: MutationObserver | null = null;


  // Real Data
  netWorth: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;
  dashboardCount: number = 0;
  budgetLimit: number = 0;
  budgetSpent: number = 0;
  budgetPercentage: number = 0;
  budgetDaysLeft: number = 0;
  periodTitle: string = 'Resumen del Mes';
  periodDaysSuffix: string = 'para el próximo período';
  netWorthLoading: boolean = true;

  constructor(
    private dashboardService: DashboardService, 
    private configService: ConfigurationService,
    private router: Router,
    private alert: AlertsService,
    private tourService: TourService
  ) {}

  goToBudgets() { this.router.navigate(['/budgets']); }
  goToGoals() { this.router.navigate(['/goals']); }
  goToReports() { this.router.navigate(['/reports']); }
  goToConfiguration() { this.router.navigate(['/configuration']); }

  ngOnInit() {
    this.setupThemeObserver();
    this.loadNetWorth();
    this.loadUpcomingDuePayments();
    this.tourService.checkAndStartAuto('dashboard', 1200);
  }

  ngOnDestroy(): void {
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }

  get isDark(): boolean {
    return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  }

  get hasMonthlyData(): boolean {
    if (!this.rawMonthlyDashboards || this.rawMonthlyDashboards.length === 0) return false;
    return this.rawMonthlyDashboards.some(d => Number(d.total_expense || 0) > 0 || Number(d.total_income || 0) > 0);
  }

  get hasCategoryData(): boolean {
    const { data } = this.rawCategoryData || {};
    return !!(data && data.length > 0 && data.some(v => Number(v) > 0));
  }

  private setupThemeObserver(): void {
    if (typeof window !== 'undefined' && typeof MutationObserver !== 'undefined') {
      this.themeObserver = new MutationObserver(() => {
        this.updateChartTheme();
      });
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  updateChartTheme(): void {
    this.buildMonthlyChart();
    this.buildCategoryChart();
  }

  buildMonthlyChart(): void {
    const isDark = this.isDark;
    const dashboards = this.rawMonthlyDashboards;

    this.monthlyChartData = {
      labels: dashboards.map(d => d.name),
      datasets: [
        {
          label: 'Gastos',
          data: dashboards.map(d => Number(d.total_expense || 0)),
          backgroundColor: '#f43f5e',
          borderRadius: 6,
          maxBarThickness: 28
        },
        {
          label: 'Ingresos',
          data: dashboards.map(d => Number(d.total_income || 0)),
          backgroundColor: '#10b981',
          borderRadius: 6,
          maxBarThickness: 28
        }
      ]
    };

    this.monthlyChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isDark ? '#e2e8f0' : '#334155',
            font: {
              family: "'Outfit', sans-serif",
              size: 12,
              weight: '500'
            },
            padding: 14,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#e2e8f0' : '#334155',
          borderColor: isDark ? 'rgba(51, 65, 85, 0.7)' : 'rgba(226, 232, 240, 0.8)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Outfit', sans-serif", weight: 'bold' },
          bodyFont: { family: "'Outfit', sans-serif" },
          callbacks: {
            title: (items: any[]) => {
              if (items.length > 0) {
                const idx = items[0].dataIndex;
                return dashboards[idx]?.name || items[0].label;
              }
              return '';
            },
            label: (context: any) => {
              let label = context.dataset.label || '';
              if (label) { label += ': '; }
              if (context.parsed.y !== null) {
                label += this.formatCurrency(context.parsed.y);
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.7)'
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: { family: "'Outfit', sans-serif", size: 11 },
            maxRotation: 0,
            minRotation: 0,
            callback: (_val: any, index: number) => {
              const label = dashboards[index]?.name || '';
              return label.length > 13 ? label.substring(0, 11) + '...' : label;
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.7)'
          },
          ticks: {
            color: isDark ? '#94a3b8' : '#64748b',
            font: { family: "'Outfit', sans-serif", size: 11 }
          }
        }
      }
    };
  }

  buildCategoryChart(): void {
    const isDark = this.isDark;
    const { labels, data } = this.rawCategoryData;

    // Modern vibrant palette for dark/light mode:
    // Emerald, Indigo, Sky, Amber, Rose, Purple, Slate
    const vibrantColors = ['#10b981', '#6366f1', '#0ea5e9', '#f59e0b', '#f43f5e', '#8b5cf6', '#64748b'];

    const hasData = data && data.length > 0 && data.some(v => v > 0);
    const chartLabels = hasData ? labels : ['Sin datos'];
    const chartData = hasData ? data : [1];
    const bgColors = hasData ? vibrantColors.slice(0, chartLabels.length) : [isDark ? '#334155' : '#e2e8f0'];

    this.categoryChartData = {
      labels: chartLabels,
      datasets: [{
        data: chartData,
        backgroundColor: bgColors,
        hoverBackgroundColor: bgColors,
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff',
        hoverOffset: 4
      }]
    };

    this.categoryChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: isDark ? '#f8fafc' : '#334155',
            font: {
              family: "'Outfit', sans-serif",
              size: 11,
              weight: '500'
            },
            padding: 12,
            boxWidth: 8,
            boxHeight: 8,
            usePointStyle: true,
            pointStyle: 'circle',
            generateLabels: (chart: any) => {
              const dataset = chart.data.datasets[0];
              const chartLbls = chart.data.labels || [];
              return chartLbls.map((l: string, i: number) => ({
                text: l,
                fillStyle: dataset.backgroundColor[i] || '#64748b',
                fontColor: isDark ? '#f8fafc' : '#334155',
                strokeStyle: 'transparent',
                lineWidth: 0,
                hidden: !chart.getDataVisibility(i),
                index: i,
                pointStyle: 'circle'
              }));
            }
          }
        },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: isDark ? '#f8fafc' : '#0f172a',
          bodyColor: isDark ? '#e2e8f0' : '#334155',
          borderColor: isDark ? 'rgba(51, 65, 85, 0.7)' : 'rgba(226, 232, 240, 0.8)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          titleFont: { family: "'Outfit', sans-serif", weight: 'bold' },
          bodyFont: { family: "'Outfit', sans-serif" },
          callbacks: {
            label: (context: any) => {
              let label = context.label || '';
              if (label) { label += ': '; }
              if (context.parsed !== null && context.parsed !== undefined) {
                label += this.formatCurrency(context.parsed);
              }
              return label;
            }
          }
        }
      }
    };
  }

  loadNetWorth() {
    this.netWorthLoading = true;
    forkJoin({
      dashboards: this.dashboardService.getDashboards(),
      profile: this.configService.getProfile().pipe(catchError(() => of(null))),
      frequencies: this.configService.getIncomeFrequencies().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ dashboards, profile, frequencies }) => {
        this.netWorth = dashboards.reduce((sum, d) => sum + Number(d.balance || 0), 0);
        this.totalIncome = dashboards.reduce((sum, d) => sum + Number(d.total_income || 0), 0);
        this.totalExpenses = dashboards.reduce((sum, d) => sum + Number(d.total_expense || 0), 0);
        this.dashboardCount = dashboards.length;

        // Frecuencia configurada por el usuario
        let freqName = '';
        if (profile) {
          if (profile.income_frequency?.name) {
            freqName = profile.income_frequency.name.toLowerCase();
          } else if (typeof (profile.income_frequency as any) === 'number') {
            const matchedFreq = frequencies.find(f => f.id === (profile.income_frequency as any));
            if (matchedFreq) freqName = matchedFreq.name.toLowerCase();
          } else {
            const freqId = (profile as any)['income_frequency_id'];
            if (freqId && frequencies.length > 0) {
              const match = frequencies.find(f => f.id === freqId);
              if (match) freqName = match.name.toLowerCase();
            }
          }
        }

        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        if (freqName.includes('quincenal') || freqName.includes('quincena') || freqName.includes('biweekly')) {
          this.periodTitle = 'Resumen Quincenal';
          this.periodDaysSuffix = 'para la próxima quincena';
          const day = today.getDate();
          if (day <= 15) {
            this.budgetDaysLeft = 15 - day;
          } else {
            this.budgetDaysLeft = lastDay.getDate() - day;
          }
        } else if (freqName.includes('semanal') || freqName.includes('semana') || freqName.includes('weekly')) {
          this.periodTitle = 'Resumen Semanal';
          this.periodDaysSuffix = 'para la próxima semana';
          const day = today.getDay();
          this.budgetDaysLeft = day === 0 ? 0 : 7 - day;
        } else {
          this.periodTitle = 'Resumen del Mes';
          this.periodDaysSuffix = 'para el próximo período';
          this.budgetDaysLeft = lastDay.getDate() - today.getDate();
        }

        // Si tiene salario configurado, usarlo como presupuesto del período
        const configuredSalary = (profile && profile.salary) ? Number(profile.salary) : 0;
        if (configuredSalary > 0) {
          this.budgetLimit = configuredSalary;
        } else {
          this.budgetLimit = this.totalIncome > 0 ? this.totalIncome : 0;
        }

        this.budgetSpent = this.totalExpenses;
        this.budgetPercentage = this.budgetLimit > 0 ? Math.min(Math.round((this.budgetSpent / this.budgetLimit) * 100), 100) : 0;

        // -- BAR CHART (Dashboards) --
        this.rawMonthlyDashboards = dashboards;
        this.buildMonthlyChart();
        this.netWorthLoading = false;

        // -- PIE CHART (Categories Global) --
        if (dashboards.length > 0) {
          const requests = dashboards.map(d => this.dashboardService.getCurrentDashboard(d.id, 'month'));
          forkJoin(requests).subscribe(responses => {
            const categorySums: { [key: string]: number } = {};
            
            responses.forEach(res => {
              if (res.expense_summary?.categories) {
                res.expense_summary.categories.forEach(cat => {
                  if (!categorySums[cat.name]) categorySums[cat.name] = 0;
                  categorySums[cat.name] += Number(cat.total_amount || 0);
                });
              }
            });

            const sortedCats = Object.entries(categorySums).sort((a, b) => b[1] - a[1]);
            const top5 = sortedCats.slice(0, 5);
            const others = sortedCats.slice(5).reduce((sum, [, amount]) => sum + amount, 0);

            const labels = top5.map(c => c[0]);
            const data = top5.map(c => c[1]);
            if (others > 0) {
              labels.push('Otros');
              data.push(others);
            }
            
            this.rawCategoryData = { labels, data };
            this.buildCategoryChart();
          });
        } else {
          // Empty states
          this.rawCategoryData = { labels: ['Sin datos'], data: [1] };
          this.buildCategoryChart();
        }
      },
      error: () => {
        this.netWorthLoading = false;
      }
    });

    this.dashboardService.getRecentTransactions().subscribe({
      next: (records) => {
        this.recentTransactions = records.map((r: any) => ({
          id: r.id,
          description: r.description,
          date: r.record_date, // Formato simplificado
          amount: (r.record_behavior === 'INCOME' ? '+' : '-') + this.formatCurrency(Number(r.amount)),
          type: r.record_behavior === 'INCOME' ? 'income' : 'expense',
          categoryIcon: r.record_behavior === 'INCOME' ? this.TrendingUp : this.ShoppingCart,
          categoryColor: r.record_behavior === 'INCOME' 
            ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40' 
            : 'text-teal-600 bg-teal-100 dark:bg-teal-900/40'
        }));
      },
      error: (err) => console.error('Error fetching recent transactions', err)
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  get stats(): Stat[] {
    return [
      {
        icon: this.Wallet,
        title: 'Patrimonio Total',
        value: this.formatCurrency(this.netWorth),
        change: `${this.dashboardCount} espacios`,
        trend: 'up',
        color: 'text-emerald-600',
        isNegative: this.netWorth < 0
      },
      {
        icon: this.TrendingUp,
        title: 'Ingresos del Mes',
        value: this.formatCurrency(this.totalIncome),
        change: '',
        trend: 'up',
        color: 'text-teal-600',
        isNegative: false
      },
      {
        icon: this.TrendingDown,
        title: 'Gastos del Mes',
        value: this.formatCurrency(this.totalExpenses),
        change: '',
        trend: 'down',
        color: 'text-red-500',
        isNegative: false
      },
      {
        icon: this.Target,
        title: 'Metas Alcanzadas',
        value: '0',
        change: '',
        trend: 'up',
        color: 'text-emerald-700',
        isNegative: false
      },
    ];
  }

  recentTransactions: Transaction[] = [];

  loadUpcomingDuePayments() {
    this.dashboardService.getUpcomingDuePayments().subscribe({
      next: (res) => {
        this.upcomingDueCount = res.count || 0;
        this.upcomingDueRecords = res.records || [];
      },
      error: (err) => console.error('Error cargando pagos próximos', err)
    });
  }

  getDaysDueText(dateStr: string): { text: string; isOverdue: boolean } {
    if (!dateStr) return { text: '', isOverdue: false };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr + 'T00:00:00');
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Venció hace ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'día' : 'días'}`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Vence hoy', isOverdue: true };
    } else if (diffDays === 1) {
      return { text: 'Vence mañana', isOverdue: false };
    } else {
      return { text: `Vence en ${diffDays} días`, isOverdue: false };
    }
  }

  markRecordAsPaid(record: any) {
    this.payingRecordId = record.id;
    this.dashboardService.getPaymentStatuses().subscribe({
      next: (statuses) => {
        const paidStatus = statuses.find(s => (s.code || '').toLowerCase() === 'paid' || (s.status || '').toLowerCase() === 'pagado');
        if (!paidStatus) {
          this.payingRecordId = null;
          return;
        }

        this.dashboardService.updateRecord(record.id, { payment_status_id: paidStatus.id }).subscribe({
          next: () => {
            this.payingRecordId = null;
            this.alert.show(`Pago "${record.description}" marcado como pagado`, 'success');
            this.loadUpcomingDuePayments();
            this.loadNetWorth();
          },
          error: () => {
            this.payingRecordId = null;
            this.alert.show('No se pudo actualizar el pago', 'error');
          }
        });
      },
      error: () => {
        this.payingRecordId = null;
      }
    });
  }
}
