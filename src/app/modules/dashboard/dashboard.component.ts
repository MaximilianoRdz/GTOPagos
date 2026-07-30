import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wallet, TrendingUp, TrendingDown, Target, ChartColumnDecreasing, Calendar, Settings, ShoppingCart, Film, Coffee, Briefcase, Code } from 'lucide-angular';
import { ChartModule } from 'primeng/chart';
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
  imports: [CommonModule, LucideAngularModule, ChartModule],
  templateUrl: './dashboard.component.html',
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

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    this.categoryChartData = {
      labels: ['Comida', 'Entretenimiento', 'Servicios', 'Otros'],
      datasets: [
        {
          data: [450, 220, 150, 100],
          backgroundColor: ['#10b981', '#14b8a6', '#0ea5e9', '#64748b'],
          hoverBackgroundColor: ['#059669', '#0d9488', '#0284c7', '#475569']
        }
      ]
    };

    this.categoryChartOptions = {
      plugins: {
        legend: { position: 'bottom' }
      },
      cutout: '70%'
    };

    this.monthlyChartData = {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [
        {
          label: 'Gastos',
          data: [650, 450, 800, 950],
          backgroundColor: '#10b981',
          borderRadius: 4
        },
        {
          label: 'Ingresos',
          data: [1200, 0, 500, 2500],
          backgroundColor: '#0ea5e9',
          borderRadius: 4
        }
      ]
    };

    this.monthlyChartOptions = {
      plugins: {
        legend: { position: 'bottom' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    };
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
