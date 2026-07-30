import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  record_type_id: number;
}

export interface CategorySummary {
  name: string;
  total_amount: number;
  total_records: number;
  paid_records: number;
  pending_amount: number;
}

export interface SummaryData {
  total_amount: number;
  total_records: number;
  paid_amount: number;
  paid_records: number;
  pending_amount: number;
  pending_records: number;
  categories: CategorySummary[];
}

export interface PendingRecord {
  id: number;
  amount: string;
  description: string;
  category: string;
  payment_status: string;
  is_recurrent: boolean;
  current_installment: number;
  total_installments: number;
}

export interface DashboardResponse {
  period_type: string;
  period_start: string;
  total_income: number;
  total_expense: number;
  balance: number;
  expense_summary: SummaryData;
  income_summary: SummaryData;
  pending_to_pay: PendingRecord[];
}

export interface DashboardItem {
  id: number;
  name: string;
  description: string;
  dashboard_type: 'EXPENSES' | 'INCOME' | 'BOTH';
  total_income: number;
  total_expense: number;
  balance: number;
  records_count: number;
}

export interface CreateDashboardPayload {
  name: string;
  description?: string;
  dashboard_type: 'EXPENSES' | 'INCOME' | 'BOTH';
}

export interface FinancialRecord {
  id: number;
  amount: string;
  description: string;
  record_date: string;
  is_recurrent: boolean;
  payment_type: 'CREDIT' | 'DEBIT';
  current_installment: number;
  total_installments: number;
  dashboard_id: number;
  record_type_id: number;
  category_id: number | null;
  category_name: string | null;
  payment_method_id: number | null;
  payment_status_id: number | null;
}

export interface FinancialRecordType {
  id: number;
  name: string;
  description: string;
}

export interface CreateFinancialRecordPayload {
  dashboard_id: number;
  record_type_id: number;
  category_id?: number | null;
  payment_method_id?: number | null;
  payment_status_id?: number | null;

  amount: number;
  description: string;
  record_date: string;

  payment_type?: 'CREDIT' | 'DEBIT';
  is_recurrent?: boolean;

  current_installment?: number;
  total_installments?: number;

  frequency_type?: string | null;
  frequency_value?: number | null;

  extra_notes?: string | null;

  currency_id?: number | null;
}

export interface RecordsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FinancialRecord[];
}

export interface PaymentStatus {
  id: number;
  status: string;
  code: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtiene el resumen del dashboard actual (ingresos y gastos)
  getCurrentDashboard(dashboardId: number, period: string = 'month'): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${this.apiUrl}/dashboard/current/?dashboard_id=${dashboardId}&period=${period}`
    );
  }

  getDashboards(): Observable<DashboardItem[]> {
    return this.http.get<DashboardItem[]>(
      `${this.apiUrl}/dashboards/`
    );
  }

  createDashboard(data: CreateDashboardPayload): Observable<DashboardItem> {
    return this.http.post<DashboardItem>(
      `${this.apiUrl}/dashboards/`,
      data
    );
  }

  updateDashboard(
    id: number,
    data: Partial<CreateDashboardPayload>
  ): Observable<DashboardItem> {
    return this.http.patch<DashboardItem>(
      `${this.apiUrl}/dashboards/${id}/`,
      data
    );
  }

  deleteDashboard(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/dashboards/${id}/`
    );
  }

  getCategories(recordTypeId?: number): Observable<Category[]> {
    let url = `${this.apiUrl}/finance-categories/`;

    if (recordTypeId) {
      url += `?record_type_id=${recordTypeId}`;
    }

    return this.http.get<Category[]>(url);
  }

  // Obtiene el historial completo paginado
  getRecords(
    dashboardId: number,
    page: number = 1,
    period: string = 'month'
  ): Observable<RecordsResponse> {
    return this.http.get<RecordsResponse>(
      `${this.apiUrl}/dashboards/${dashboardId}/records/?page=${page}&period=${period}`
    );
  }

  getRecordTypes(): Observable<FinancialRecordType[]> {
    return this.http.get<FinancialRecordType[]>(
      `${this.apiUrl}/financial-record-types/`
    );
  }

  createRecord(data: CreateFinancialRecordPayload): Observable<FinancialRecord> {
    return this.http.post<FinancialRecord>(
      `${this.apiUrl}/financial-records/`,
      data
    );
  }

  updateRecord(id: number, data: Partial<CreateFinancialRecordPayload>): Observable<FinancialRecord> {
    return this.http.patch<FinancialRecord>(
      `${this.apiUrl}/financial-records/${id}/`,
      data
    );
  }

  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/financial-records/${id}/`
    );
  }

  getPaymentStatuses(): Observable<PaymentStatus[]> {
    return this.http.get<PaymentStatus[]>(
      `${this.apiUrl}/payment-statuses/`
    );
  }
  
}
