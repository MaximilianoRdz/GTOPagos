export type DashboardType = 'EXPENSE' | 'INCOME' | 'BOTH' | string;

export interface UserFinanceDashboard {
  id: number;
  name: string;
  description?: string;
  monthly_budget?: number | null;
  dashboard_type: DashboardType;
  total_income?: number;
  total_expense?: number;
  balance?: number;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}
