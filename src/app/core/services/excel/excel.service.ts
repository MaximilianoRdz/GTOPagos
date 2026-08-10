import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';

export interface ImportedTransaction {
  row_index: number;
  record_date: string;
  description: string;
  amount: number;
  behavior: 'EXPENSE' | 'INCOME';
  category_id: number | null;
  category_name: string;
  is_duplicate: boolean;
  selected: boolean;
  dashboardId?: number | null;
  is_recurrent?: boolean;
  occurrences?: number;
  is_installment?: boolean;
  current_installment?: number;
  total_installments?: number;
}

export interface ImportConfirmPayload {
  dashboard_id: number;
  records: ImportedTransaction[];
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadForPreview(file: File, dashboardId: number): Observable<{ records: ImportedTransaction[] }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('dashboard_id', dashboardId.toString());

    return this.http.post<{ records: ImportedTransaction[] }>(
      `${this.apiUrl}/import/preview/`,
      formData
    );
  }

  confirmImport(payload: ImportConfirmPayload): Observable<{ inserted: number }> {
    return this.http.post<{ inserted: number }>(
      `${this.apiUrl}/import/confirm/`,
      payload
    );
  }

  exportDashboard(dashboardId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/export/?dashboard_id=${dashboardId}`,
      { responseType: 'blob' }
    );
  }
}
