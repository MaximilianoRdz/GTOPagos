import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wallet, TrendingUp, TrendingDown, Target, ChartColumnDecreasing, Calendar, Settings, ShoppingCart, Film, Coffee, Briefcase, Code } from 'lucide-angular';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardService } from '../../core/services/dashboard/dashboard.service';
import { forkJoin } from 'rxjs';

interface Stat {
  icon: any;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  color: string;
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
  imports: [CommonModule, LucideAngularModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
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

  // Chart Data
  categoryChartData: any;
  categoryChartOptions: any;
  monthlyChartData: any;
  monthlyChartOptions: any;

  // Real Data
  netWorth: number = 0;
  totalIncome: number = 0;
  totalExpenses: number = 0;
  netWorthLoading: boolean = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadNetWorth();
  }

  loadNetWorth() {
    this.dashboardService.getDashboards().subscribe({
      next: (dashboards) => {
        this.netWorth = dashboards.reduce((sum, d) => sum + Number(d.balance || 0), 0);
        this.totalIncome = dashboards.reduce((sum, d) => sum + Number(d.total_income || 0), 0);
        this.totalExpenses = dashboards.reduce((sum, d) => sum + Number(d.total_expense || 0), 0);
        
        // Update mocked stats dynamically
        this.stats[0].title = 'Patrimonio Total';
        this.stats[0].value = this.formatCurrency(this.netWorth);
        this.stats[0].change = `${dashboards.length} espacios`;
        
        this.stats[1].value = this.formatCurrency(this.totalIncome);
        this.stats[2].value = this.formatCurrency(this.totalExpenses);
        
        // -- BAR CHART (Dashboards) --
        this.monthlyChartData = {
          labels: dashboards.map(d => d.name),
          datasets: [
            {
              label: 'Gastos',
              data: dashboards.map(d => Number(d.total_expense || 0)),
              backgroundColor: '#ef4444',
              borderRadius: 4
            },
            {
              label: 'Ingresos',
              data: dashboards.map(d => Number(d.total_income || 0)),
              backgroundColor: '#10b981',
              borderRadius: 4
            }
          ]
        };

        this.monthlyChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } },
          scales: { y: { beginAtZero: true } }
        };
        
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
            
            const colors = ['#10b981', '#14b8a6', '#0ea5e9', '#6366f1', '#a855f7', '#64748b'];

            this.categoryChartData = {
              labels: labels.length > 0 ? labels : ['Sin datos'],
              datasets: [{
                data: data.length > 0 ? data : [1],
                backgroundColor: data.length > 0 ? colors.slice(0, labels.length) : ['#e2e8f0'],
                hoverBackgroundColor: data.length > 0 ? colors.slice(0, labels.length) : ['#e2e8f0']
              }]
            };

            this.categoryChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'bottom' } },
              cutout: '70%'
            };
          });
        } else {
          // Empty states
          this.categoryChartData = {
            labels: ['Sin datos'],
            datasets: [{ data: [1], backgroundColor: ['#e2e8f0'] }]
          };
          this.categoryChartOptions = { responsive: true, maintainAspectRatio: false, cutout: '70%' };
        }
      },
      error: () => {
        this.netWorthLoading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  stats: Stat[] = [
    {
      icon: this.Wallet,
      title: 'Presupuesto',
      value: '$3,000.00',
      change: '+5%',
      trend: 'up',
      color: 'text-emerald-600'
    },
    {
      icon: this.TrendingUp,
      title: 'Ingresos del Mes',
      value: '$4,200.00',
      change: '+10%',
      trend: 'up',
      color: 'text-teal-600'
    },
    {
      icon: this.TrendingDown,
      title: 'Gastos del Mes',
      value: '$2,850.00',
      change: '-3%',
      trend: 'down',
      color: 'text-red-500'
    },
    {
      icon: this.Target,
      title: 'Metas Alcanzadas',
      value: '7',
      change: '+2%',
      trend: 'up',
      color: 'text-emerald-700'
    },
  ];

  recentTransactions: Transaction[] = [
    {
      id: 1,
      description: 'Pago freelance',
      date: '30 de junio',
      amount: '+$1,200.00',
      type: 'income',
      categoryIcon: this.Code,
      categoryColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40'
    },
    {
      id: 2,
      description: 'Supermercado',
      date: '28 de junio',
      amount: '-$450.00',
      type: 'expense',
      categoryIcon: this.ShoppingCart,
      categoryColor: 'text-teal-600 bg-teal-100 dark:bg-teal-900/40'
    },
    {
      id: 3,
      description: 'Netflix',
      date: '26 de junio',
      amount: '-$220.00',
      type: 'expense',
      categoryIcon: this.Film,
      categoryColor: 'text-rose-600 bg-rose-100 dark:bg-rose-900/40'
    },
    {
      id: 4,
      description: 'Venta producto',
      date: '25 de junio',
      amount: '+$500.00',
      type: 'income',
      categoryIcon: this.Briefcase,
      categoryColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40'
    },
    {
      id: 5,
      description: 'Restaurante',
      date: '24 de junio',
      amount: '-$350.00',
      type: 'expense',
      categoryIcon: this.Coffee,
      categoryColor: 'text-orange-600 bg-orange-100 dark:bg-orange-900/40'
    },
  ];
}
