import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';

export interface ReportSummary {
  total_income: number;
  total_expense: number;
  balance: number;
}

export interface ReportData {
  summary: ReportSummary;
  records: any[]; // Usaremos la misma estructura que FinancialRecord
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReportData(dashboardId: number, startDate: string, endDate: string): Observable<ReportData> {
    let params = new HttpParams().set('dashboard_id', dashboardId.toString());
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get<ReportData>(`${this.apiUrl}/reports/data/`, { params });
  }

  downloadReport(dashboardId: number, startDate: string, endDate: string, format: 'pdf' | 'excel'): Observable<Blob> {
    let params = new HttpParams()
      .set('dashboard_id', dashboardId.toString())
      .set('export_format', format);
      
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);

    return this.http.get(`${this.apiUrl}/reports/download/`, { 
      params,
      responseType: 'blob' 
    });
  }
}
