import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SHARED_IMPORTS } from '../../../../shared/shared.config';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { forkJoin, finalize } from 'rxjs';
import { AlertsService } from '../../../../core/services/alerts/Alerts.service';
import {
  Plus,
  Trash2,
  X,
  Pencil,
  LayoutDashboard,
  CheckCircle,
  Sparkles,
} from 'lucide-angular';

import {
  DashboardService,
  DashboardItem,
} from '../../../../core/services/dashboard/dashboard.service';
import { ExcelService, ImportedTransaction } from '../../../../core/services/excel/excel.service';
import { Category } from '../../../../shared/models';
import { TourService } from '../../../../core/services/tour/tour.service';

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
  readonly Sparkles = Sparkles;
  LayoutDashboard = LayoutDashboard;
  CheckCircle = CheckCircle;

  startTour(): void {
    this.tourService.start('budgets', true);
  }

  dashboards: DashboardItem[] = [];
  expenseDashboardsList: DashboardItem[] = [];
  incomeDashboardsList: DashboardItem[] = [];
  editingDashboard: DashboardItem | null = null;
  showCreateModal = false;

  importedTransactions: ImportedTransaction[] = [];
  importedRecords: any[] = [];
  showImportModal = false;

  categories: Category[] = [];
  isConfirmingImport = false;
  loading = true;
  private destroyRef = inject(DestroyRef);
  private tourService = inject(TourService);

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
    this.tourService.checkAndStartAuto('budgets', 1000);
  }

  // =========================
  // GETTERS
  // =========================


  formatCurrency(amount: number): string {

    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);

  }

  loadDashboards(): void {

    this.dashboardService.getDashboards().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
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
    this.editingDashboard = dashboard || null;
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.editingDashboard = null;
  }

  handleDashboardSave(data: { name: string; description: string; monthly_budget?: number | null; dashboard_type: 'EXPENSES' | 'INCOME' | 'BOTH' }): void {
    if (this.editingDashboard) {
      this.dashboardService
        .updateDashboard(this.editingDashboard.id, data)
        .subscribe({
          next: () => {
            this.alert.show('Dashboard actualizado correctamente', 'success');
            this.closeCreateModal();
            this.loadDashboards();
          },
          error: () => {
            this.alert.show('Error al actualizar el dashboard', 'error');
          }
        });
      return;
    }

    this.dashboardService
      .createDashboard(data)
      .subscribe({
        next: () => {
          this.alert.show('Dashboard creado correctamente', 'success');
          this.closeCreateModal();
          this.loadDashboards();
        },
        error: () => {
          this.alert.show('Error al crear el dashboard', 'error');
        }
      });
  }

  async deleteDashboard(dashboard: DashboardItem): Promise<void> {
    const confirmed = await this.alert.askConfirm(
      'Eliminar Dashboard',
      `¿Estás seguro de eliminar el espacio "${dashboard.name}" permanentemente? No podrás recuperarlo después.`,
      'Sí, eliminar',
      'danger'
    );

    if (confirmed) {
      this.dashboardService.deleteDashboard(dashboard.id).subscribe({
        next: () => {
          this.alert.show('Dashboard eliminado correctamente', 'success');
          this.loadDashboards();
        },
        error: () => {
          this.alert.show('Error al eliminar el dashboard', 'error');
        }
      });
    }
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

handleImportConfirm(itemsToImport: any[]): void {
  this.isConfirmingImport = true;
  const grouped = itemsToImport.reduce((acc, curr) => {
    const dId = curr.dashboardId;
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

  forkJoin(requests)
    .pipe(finalize(() => { this.isConfirmingImport = false; }))
    .subscribe({
      next: () => {
        this.alert.show('Movimientos importados correctamente', 'success');
        this.closeImportModal();
        this.loadDashboards();
      },
      error: () => {
        this.alert.show('Error al importar movimientos', 'error');
      }
    });
}

loadCategories(): void {
  this.dashboardService
    .getCategories().pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe({
      next: (data) => {
        this.categories = data as Category[];
      },
      error: () => {
        this.alert.show(
          'No se pudieron cargar las categorías',
          'error'
        );
      }
    });
}

}
