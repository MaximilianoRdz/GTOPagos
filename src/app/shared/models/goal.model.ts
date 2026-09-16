export interface FinancialGoal {
  id?: number;
  name: string;
  target_amount: number;
  saved_amount: number;
  target_date?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectedGoal extends FinancialGoal {
  disposableIncome: number;
  monthsToReach: number;
  recommendedSavings: number;
  progressPercentage: number;
}
