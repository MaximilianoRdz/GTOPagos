import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wallet, TrendingUp, TrendingDown, Target, ChartColumnDecreasing, Calendar, Settings } from 'lucide-angular';

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
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, LucideAngularModule],
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
      color: 'text-blue-600'
    },
    {
      icon: this.TrendingDown,
      title: 'Gastos del Mes',
      value: '$2,850.00',
      change: '-3%',
      trend: 'down',
      color: 'text-red-600'
    },
    {
      icon: this.Target,
      title: 'Metas Alcanzadas',
      value: '7',
      change: '+2%',
      trend: 'up',
      color: 'text-purple-600'
    },
  ];

  recentTransactions: Transaction[] = [
    {
      id: 1,
      description: 'Pago freelance',
      date: '30 de junio',
      amount: '+$1,200.00',
      type: 'income'
    },
    {
      id: 2,
      description: 'Supermercado',
      date: '28 de junio',
      amount: '-$450.00',
      type: 'expense'
    },
    {
      id: 3,
      description: 'Netflix',
      date: '26 de junio',
      amount: '-$220.00',
      type: 'expense'
    },
    {
      id: 4,
      description: 'Venta producto',
      date: '25 de junio',
      amount: '+$500.00',
      type: 'income'
    },
    {
      id: 5,
      description: 'Restaurante',
      date: '24 de junio',
      amount: '-$350.00',
      type: 'expense'
    },
  ];
}
