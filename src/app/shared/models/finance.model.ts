export interface Category {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  is_expense?: boolean;
}

export interface FinancialRecordType {
  id?: number;
  name?: string;
  behavior: 'INCOME' | 'EXPENSE' | 'TRANSFER' | string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code?: string;
}

export interface PaymentStatus {
  id: number;
  name: string;
  code?: string;
}

export interface FinancialRecord {
  id?: number;
  user?: number;
  dashboard?: number;
  record_type: FinancialRecordType;
  category?: Category | null;
  payment_method?: PaymentMethod | null;
  payment_status?: PaymentStatus | null;
  amount: number;
  description: string;
  record_date: string;
  is_recurrent?: boolean;
  current_installment?: number | null;
  total_installments?: number | null;
  financial_goal?: number | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}
