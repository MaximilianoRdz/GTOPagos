export interface ReportRecordCategory {
  id?: number;
  name: string;
}

export interface ReportRecordType {
  id?: number;
  name?: string;
  behavior: 'INCOME' | 'EXPENSE' | 'TRANSFER' | string;
}

export interface ReportRecord {
  id?: number;
  record_date: string;
  description: string;
  amount: number;
  category?: ReportRecordCategory | null;
  record_type?: ReportRecordType | null;
}

export interface ReportSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface ReportData {
  records: ReportRecord[];
  summary: ReportSummary;
}
