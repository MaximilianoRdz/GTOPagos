import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SHARED_IMPORTS } from '../../../../shared/shared.config';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';
import { AlertsService } from '../../../../core/services/alerts/alerts.service';
import {
  Plus,
  Trash2,
  X,
  Pencil,
} from 'lucide-angular';

import {
  DashboardService,
  DashboardItem,
} from '../../../../core/services/dashboard/dashboard.service';
import { ExcelService, ImportedTransaction } from '../../../../core/services/excel/excel.service';

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: SHARED_IMPORTS,
  templateUrl: './dashboards.component.html',
})
export class DashboardsComponent implements OnInit {

  readonly Plus = Plus;
  readonly Trash2 = Trash2;
  readonly X = X;
  readonly Pencil = Pencil;

  dashboards: DashboardItem[] = [];
  expenseDashboardsList: DashboardItem[] = [];
  incomeDashboardsList: DashboardItem[] = [];
  editingDashboard: DashboardItem | null = null;

  showDeleteModal = false;
  dashboardToDelete: number | null = null;

  importedTransactions: ImportedTransaction[] = [];
  importedRecords: any[] = [];
  showImportModal = false;

  categories: any[] = [];

  loading = true;

  showCreateModal = false;

  dashboardTypes = [
    {
      label: 'Solo gastos',
      value: 'EXPENSES'
    },
    {
      label: 'Solo ingresos',
      value: 'INCOME'
    },
    {
      label: 'Ambos',
      value: 'BOTH'
    }
  ];

  dashboardForm = {
    name: '',
    description: '',
    dashboard_type: 'BOTH' as 'EXPENSES' | 'INCOME' | 'BOTH',
  };
  

  constructor(
    private dashboardService: DashboardService,
    private excelService: ExcelService,
    private router: Router,
    public alert: AlertsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboards();
    this.loadCategories();
  }

  // =========================
  // GETTERS
  // =========================

  getDashboardsForItem(item: ImportedTransaction) {
    if (item.behavior === 'INCOME') {
      return this.incomeDashboardsList;
    }
    return this.expenseDashboardsList;
  }

  formatCurrency(amount: number): string {

    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);

  }

  loadDashboards(): void {

    this.dashboardService.getDashboards()
      .subscribe({
        next: (data) => {
          const validData = Array.isArray(data) ? data : [];
          this.dashboards = validData;
          this.expenseDashboardsList = validData.filter(d => d.dashboard_type === 'EXPENSES' || d.dashboard_type === 'BOTH');
          this.incomeDashboardsList = validData.filter(d => d.dashboard_type === 'INCOME' || d.dashboard_type === 'BOTH');
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;

          this.alert.show(
            'No se pudieron cargar los dashboards',
            'error'
          );
          this.cdr.detectChanges();
        }
      });

  }

  openDashboard(id: number): void {
    this.router.navigate(['/budgets', id]);
  }

  openCreateModal(dashboard?: DashboardItem): void {

    this.showCreateModal = true;

    if (dashboard) {
      this.editingDashboard = dashboard;

      this.dashboardForm = {
        name: dashboard.name,
        description: dashboard.description,
        dashboard_type: dashboard.dashboard_type,
      };

      return;
    }

    this.editingDashboard = null;

    this.dashboardForm = {
      name: '',
      description: '',
      dashboard_type: 'BOTH',
    };
  }

  closeCreateModal(): void {

    this.showCreateModal = false;

    this.editingDashboard = null;

    this.dashboardForm = {
      name: '',
      description: '',
      dashboard_type: 'BOTH',
    };
  }

  createDashboard(): void {

    if (!this.dashboardForm.name.trim()) {

      this.alert.show(
        'El nombre del dashboard es requerido',
        'error'
      );

      return;
    }

    if (this.editingDashboard) {
      this.dashboardService
        .updateDashboard(this.editingDashboard.id, this.dashboardForm)
        .subscribe({
          next: () => {
            this.alert.show(
              'Dashboard actualizado correctamente',
              'success'
            );
            this.closeCreateModal();
            this.loadDashboards();

          },

          error: (err) => {
            this.alert.show('Error al actualizar el dashboard', 'error');
          }
        });

      return;
  }

  this.dashboardService
    .createDashboard(this.dashboardForm)
    .subscribe({
      next: () => {

        this.alert.show(
          'Dashboard creado correctamente',
          'success'
        );
        this.closeCreateModal();
        this.loadDashboards();

      },

      error: (err) => {
        this.alert.show('Error al crear el dashboard', 'error');
      }
    });
  }

  deleteDashboard(dashboardId: number, event: MouseEvent): void {
    event.stopPropagation();

    this.dashboardToDelete = dashboardId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {

  this.showDeleteModal = false;
  this.dashboardToDelete = null;
}

confirmDelete(): void {

  if (!this.dashboardToDelete) return;

  this.dashboardService.deleteDashboard(this.dashboardToDelete).subscribe({
      next: () => {

        this.alert.show(
          'Dashboard eliminado correctamente',
          'success'
        );

        this.closeDeleteModal();
        this.loadDashboards();
      },

      error: (err) => {
        this.alert.show(
          'Error al eliminar el dashboard',
          'error'
        );
      }
    });
}

onFileChange(event: any): void {
  const file = event.target.files?.[0];
  if (!file) return;

  // Let's assume the user doesn't pass a dashboardId initially (they select it in the modal)
  this.excelService.uploadForPreview(file, 0).subscribe({
    next: (res) => {
      // res.records contains the backend parsed records
      // we need to adapt them to ImportedTransaction (or our new interface)
      this.importedTransactions = res.records.map((r: any) => ({
        ...r,
        selected: !r.is_duplicate,
        dashboardId: null
      }));
      this.showImportModal = true;
      this.alert.show(`${this.importedTransactions.length} movimientos detectados`, 'success');
      this.cdr.detectChanges();
    },
    error: (err) => {
      this.alert.show('No se pudo analizar el archivo', 'error');
      this.cdr.detectChanges();
    }
  });

  // limpiar input
  event.target.value = '';
}

closeImportModal(): void {
  this.showImportModal = false;
  this.importedTransactions = [];
}

  canImport(): boolean {
    const selected = this.importedTransactions.filter(item => item.selected);
    if (selected.length === 0) return false;
    return selected.every(item => item.dashboardId != null);
  }

  confirmImport(): void {
    const itemsToImport = this.importedTransactions.filter(item => item.selected);
    
    if (itemsToImport.length === 0) {
      this.alert.show('Debes seleccionar al menos un movimiento para importar', 'error');
      return;
    }

    const invalidItems = itemsToImport.filter(item => (item as any).dashboardId == null);

    if (invalidItems.length) {
      this.alert.show('Todos los movimientos seleccionados deben tener un dashboard asignado', 'error');
      return;
    }
  
    // We need to send them grouped by dashboard_id
    const grouped = itemsToImport.reduce((acc, curr) => {
        const dId = (curr as any).dashboardId;
        if (!acc[dId]) acc[dId] = [];
        acc[dId].push(curr);
        return acc;
    }, {} as Record<number, any[]>);
    
    const requests = Object.keys(grouped).map(dId => {
        return this.excelService.confirmImport({
            dashboard_id: Number(dId),
            records: grouped[Number(dId)]
        });
    });

    forkJoin(requests).subscribe({
      next: () => {
        this.alert.show('Movimientos importados correctamente', 'success');
        this.closeImportModal();
        this.loadDashboards();
      },
      error: (err) => {
        this.alert.show('Error al importar movimientos', 'error');
      }
    });
  }

loadCategories(): void {

  this.dashboardService
    .getCategories()
    .subscribe({

      next: (data) => {
        this.categories =
          data;
      },

      error: (err) => {

        this.alert.show(
          'No se pudieron cargar las categorías',
          'error'
        );
      }
    });
}

}
