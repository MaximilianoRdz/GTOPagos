import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, FileText, Download, Filter, TrendingUp, TrendingDown, DollarSign, Calendar, Search } from 'lucide-angular';
import { ReportsService, ReportData } from '../../../core/services/reports/reports.service';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';
import { formatCurrency } from '@angular/common';
import { SHARED_IMPORTS } from '../../../shared/shared.config';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, ...SHARED_IMPORTS],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit {
  // Icons
  FileText = FileText;
  Download = Download;
  Filter = Filter;
  TrendingUp = TrendingUp;
  TrendingDown = TrendingDown;
  DollarSign = DollarSign;
  Calendar = Calendar;
  Search = Search;

  dashboards: any[] = [];
  selectedDashboardId: number | null = null;
  startDate: string = '';
  endDate: string = '';

  reportData: ReportData | null = null;
  isLoading = false;

  constructor(
    private reportsService: ReportsService,
    private dashboardService: DashboardService,
    private alertsService: AlertsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadDashboards();
    
    // Set default dates to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    this.startDate = firstDay.toISOString().split('T')[0];
    this.endDate = lastDay.toISOString().split('T')[0];
  }

  loadDashboards() {
    this.dashboardService.getDashboards().subscribe({
      next: (response) => {
        this.dashboards = response;
        if (this.dashboards.length > 0) {
          this.selectedDashboardId = this.dashboards[0].id;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.alertsService.show('No se pudieron cargar las cuentas.', 'error');
      }
    });
  }

  generateReport() {
    if (!this.selectedDashboardId) {
      this.alertsService.show('Por favor selecciona una cuenta.', 'error');
      return;
    }
    if (!this.startDate || !this.endDate) {
      this.alertsService.show('Por favor selecciona un rango de fechas.', 'error');
      return;
    }

    this.isLoading = true;
    this.reportsService.getReportData(this.selectedDashboardId, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.reportData = data;
        this.isLoading = false;
        if (data.records.length === 0) {
          this.alertsService.show('No se encontraron movimientos en este periodo.', 'info');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.alertsService.show('Hubo un error al generar el reporte.', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  download(format: 'pdf' | 'excel') {
    if (!this.selectedDashboardId || !this.reportData || this.reportData.records.length === 0) {
      this.alertsService.show('No hay datos para descargar.', 'error');
      return;
    }

    this.alertsService.show('Preparando tu archivo...', 'info');

    this.reportsService.downloadReport(this.selectedDashboardId, this.startDate, this.endDate, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = format === 'pdf' ? 'pdf' : 'xlsx';
        a.download = `Reporte_${this.startDate}_al_${this.endDate}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.alertsService.show('Hubo un error al descargar el archivo.', 'error');
      }
    });
  }

  formatCurrencyValue(value: number): string {
    return formatCurrency(value, 'en-US', '$');
  }
}
