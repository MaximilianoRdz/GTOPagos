import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.config';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';
import { AlertsService } from '../../core/services/alerts/alerts.service';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Pencil,
  Trash,
} from 'lucide-angular';

import {
  DashboardService,
  DashboardResponse,
  RecordsResponse,
  CreateFinancialRecordPayload,
  FinancialRecordType,
  Category,
  FinancialRecord,
  DashboardItem,
  PaymentStatus
} from '../../core/services/dashboard/dashboard.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: SHARED_IMPORTS,
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './budget.component.html',
})
export class BudgetComponent implements OnInit {

  // Iconos
  readonly TrendingUp = TrendingUp;
  readonly TrendingDown = TrendingDown;
  readonly Wallet = Wallet;
  readonly DollarSign = DollarSign;
  readonly Clock = Clock;
  readonly CheckCircle = CheckCircle;
  readonly AlertCircle = AlertCircle;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;
  readonly Plus = Plus;
  readonly X = X;
  readonly Pencil = Pencil;
  readonly Trash = Trash;

  // Tab activo
  activeTab: 'expenses' | 'income' = 'expenses';
  selectedPeriod: 'month' | 'q1' | 'q2' = 'month';
  recordFilter: 'all' | 'pending' | 'msi' = 'all';

  // Datos dashboard
  dashboardData: DashboardResponse | null = null;
  loading = true;
  error: string | null = null;

  recordTypes: FinancialRecordType[] = [];

  expenseRecordTypeId: number | null = null;
  incomeRecordTypeId: number | null = null;

  categories: Category[] = [];

  // =========================
  // PAYMENT OPTIONS
  // =========================

  paymentTypes = [
    {
      label: 'Contado',
      value: 'DEBIT'
    },
    {
      label: 'Crédito',
      value: 'CREDIT'
    }
  ];

  installmentOptions = [1, 3, 6, 9, 12, 18, 24];

  selectedDashboardId: number | null = null;
  selectedDashboard: DashboardItem | null = null;

  // Paginación
  currentPage = 1;
  recordsData: RecordsResponse | null = null;

  loadingRecords = false;

  showCreateModal = false;

  editingRecord: FinancialRecord | null = null;

  showDeleteModal = false;
  recordToDelete: number | null = null;

  creatingRecord = false;
  deletingRecord = false;

  paymentStatuses: PaymentStatus[] = [];

  paidStatusId: number | null = null;
  pendingStatusId: number | null = null;

  isCredit: boolean = false;

  formData = {
    amount: null as number | null,
    description: '',
    category_id: null as number | null,
    payment_status_id: null as number | null,
    payment_type: 'DEBIT' as 'DEBIT' | 'CREDIT',
    total_installments: 1,
    record_date: new Date().toISOString().split('T')[0],
  };

  constructor(private dashboardService: DashboardService, private route: ActivatedRoute, private location: Location, private alert: AlertsService) {}

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.selectedDashboardId = id;

    this.loadDashboardInfo();
    this.loadDashboard();
    this.loadRecords(1);
    this.loadRecordTypes();

    this.loadPaymentStatuses();
  }

  goBack(): void {
    this.location.back();
  }

  switchPeriod(period: 'month' | 'q1' | 'q2'): void {
    if (this.selectedPeriod === period) return;
    this.selectedPeriod = period;
    this.loadDashboard();
    this.loadRecords(1);
  }

  // =========================
  // GETTERS
  // =========================

  get isExpenses(): boolean {
    return this.activeTab === 'expenses';
  }

  get currentRecordTypeName(): string {
    return this.isExpenses ? 'Gasto' : 'Ingreso';
  }

  get isExpenseOnly(): boolean {
    return this.selectedDashboard?.dashboard_type === 'EXPENSES';
  }

  get isIncomeOnly(): boolean {
    return this.selectedDashboard?.dashboard_type === 'INCOME';
  }

  get isBoth(): boolean {
    return this.selectedDashboard?.dashboard_type === 'BOTH';
  }

  get filteredRecords(): FinancialRecord[] {

    if (!this.recordsData?.results || !this.selectedDashboardId) {
      return [];
    }

    const currentTypeId = this.getCurrentRecordTypeId();

    return this.recordsData.results.filter(
      (record) => {
        const typeMatch = Number(record.record_type_id) === Number(currentTypeId);
        const dashMatch = Number(record.dashboard_id) === Number(this.selectedDashboardId);
        
        if (!typeMatch || !dashMatch) return false;

        if (this.recordFilter === 'pending') {
          return record.payment_status_id === this.pendingStatusId;
        }

        if (this.recordFilter === 'msi') {
          return record.payment_type === 'CREDIT' && (record.total_installments || 1) > 1;
        }

        return true;
      }
    );
  }

  // =========================
  // MODAL
  // =========================

  openCreateModal(): void {

    const recordTypeId =
      this.getCurrentRecordTypeId();

    if (!recordTypeId) {
      this.alert.show(
        'Los tipos de registros aún están cargando',
        'info'
      );
      return;
    }

    this.showCreateModal = true;
    this.loadCategories(recordTypeId);
  }

  closeCreateModal(): void {

    this.showCreateModal = false;
    this.categories = [];

    this.editingRecord = null;

    this.resetForm();
  }

  resetForm(): void {
    this.isCredit = false;
    this.formData = {
      amount: null,
      description: '',
      category_id: null,
      payment_status_id: null,
      payment_type: 'DEBIT',
      total_installments: 1,
      record_date: new Date().toISOString().split('T')[0],
    };
  }

  // =========================
  // DASHBOARD
  // =========================

  loadDashboard(): void {
    if (!this.selectedDashboardId) return;

    this.loading = true;
    this.error = null;

    this.dashboardService
      .getCurrentDashboard(this.selectedDashboardId, this.selectedPeriod)
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Error al cargar el dashboard';
          this.loading = false;
        },
      });
  }

  loadDashboardInfo(): void {

    if (!this.selectedDashboardId) return;

    this.dashboardService
      .getDashboards()
      .subscribe({

        next: (dashboards) => {

          this.selectedDashboard =
            dashboards.find(
              dashboard =>
                dashboard.id === this.selectedDashboardId
            ) || null;

          // AUTO TAB
          switch (
            this.selectedDashboard?.dashboard_type
          ) {

            case 'INCOME':
              this.activeTab = 'income';
              break;

            case 'EXPENSES':
              this.activeTab = 'expenses';
              break;

            case 'BOTH':
            default:
              this.activeTab = 'expenses';
              break;
          }
        },

        error: (err) => {
          console.error(
            'Error loading dashboard info:',
            err
          );
        },
      });
  }

  // =========================
  // RECORDS
  // =========================

  loadRecords(page: number, append: boolean = false): void {
    if (!this.selectedDashboardId) return;

    this.loadingRecords = true;

    this.dashboardService
      .getRecords(this.selectedDashboardId, page, this.selectedPeriod).subscribe({
        next: (data) => {
          if (append && this.recordsData) {
            this.recordsData.results = [...this.recordsData.results, ...data.results];
            this.recordsData.next = data.next;
            this.recordsData.count = data.count;
          } else {
            this.recordsData = data;
          }
          this.currentPage = page;
          this.loadingRecords = false;
        },
        error: (err) => {
          this.loadingRecords = false;
        },
      });
  }

  createRecord(): void {
    if (this.creatingRecord) return;
    if (!this.selectedDashboardId) return;

    const recordTypeId = this.getCurrentRecordTypeId();

    if (!recordTypeId) {
      this.alert.show(
        'Los tipos de registros aún están cargando',
        'info'
      );
      return;
    }

    if (this.paidStatusId === null || this.pendingStatusId === null) {
      this.alert.show(
        'Estados de pago aún cargando',
        'info'
      );
      return;
    }

    if (this.formData.amount === null || this.formData.amount <= 0) {
      this.alert.show(
        'Monto requerido',
        'info'
      );
      return;
    }

    if (!this.formData.category_id) {
      this.alert.show(
        'Categoría requerida',
        'info'
      );
      return;
    }


    const payload: CreateFinancialRecordPayload = {
      dashboard_id: this.selectedDashboardId,
      record_type_id: recordTypeId,
      amount: this.formData.amount,
      description: this.formData.description,
      record_date: this.formData.record_date,
      category_id: this.formData.category_id,
      payment_status_id:
        this.isCredit
          ? this.pendingStatusId : this.paidStatusId,
      payment_type: (this.isCredit ? 'CREDIT' : 'DEBIT') as 'CREDIT' | 'DEBIT',
      total_installments:
        this.isCredit
          ? this.formData.total_installments || 1
          : 1,
    };

    this.creatingRecord = true;
    this.dashboardService
      .createRecord(payload)
      .pipe(
        finalize(() => {
          this.creatingRecord = false;
        })
      )
      .subscribe({
        next: () => {

          this.closeCreateModal();
          this.loadDashboard();
          this.loadRecords(1);

          this.alert.show(
            'Movimiento creado correctamente',
            'success'
          );
        },

        error: (err) => {
          this.alert.show(
            'Error al crear movimiento',
            'error'
          );
        },
      });
  }

  // =========================
  // RECORD TYPES
  // =========================

  loadRecordTypes(): void {

    this.dashboardService.getRecordTypes().subscribe({
      next: (data) => {

        this.recordTypes = data;

        data.forEach((type) => {

          const name = type.name.toLowerCase();

          if (
            name.includes('expense') ||
            name.includes('gasto')
          ) {
            this.expenseRecordTypeId = type.id;
          }

          if (
            name.includes('income') ||
            name.includes('ingreso')
          ) {
            this.incomeRecordTypeId = type.id;
          }

        });
      },
    });

  }

  loadCategories(recordTypeId: number): void {
    this.dashboardService.getCategories(recordTypeId).subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  // =========================
  // TABS & FILTERS
  // =========================

  setFilter(filter: 'all' | 'pending' | 'msi'): void {
    this.recordFilter = filter;
  }

  switchTab(tab: 'expenses' | 'income'): void {

    if (this.isExpenseOnly && tab === 'income') {
      return;
    }

    if (this.isIncomeOnly && tab === 'expenses') {
      return;
    }

    if (this.activeTab === tab) {
      return;
    }

    this.activeTab = tab;
    this.recordFilter = 'all';

    this.formData.category_id = null;

    // refresca lista
    this.loadRecords(1);

    if (this.showCreateModal) {
      const recordTypeId =
        this.getCurrentRecordTypeId();

      if (recordTypeId) {
        this.loadCategories(recordTypeId);
      }
    }
  }

  openEditModal(record: FinancialRecord): void {
    this.editingRecord = record;
    this.showCreateModal = true;
    this.isCredit = record.payment_type === 'CREDIT';

    this.formData = {
      amount: Number(record.amount),
      description: record.description || '',
      category_id: record.category_id,
      payment_status_id: record.payment_status_id,
      payment_type: record.payment_type,
      total_installments: record.total_installments || 1,
      record_date: record.record_date,
    };

    this.loadCategories(
      record.record_type_id
    );
  }

  updateRecord(): void {
    if (this.creatingRecord) return;
    if (!this.editingRecord) return;

    if (this.paidStatusId === null || this.pendingStatusId === null) {
      this.alert.show(
        'Estados de pago aún cargando',
        'info'
      );
      return;
    }

    if (this.formData.amount === null || this.formData.amount <= 0) {
      this.alert.show(
        'Ingresa un monto válido',
        'info'
      );
      return;
    }

    if (!this.formData.category_id) {
      this.alert.show(
        'Categoría requerida',
        'info'
      );
      return;
    }

    const payload = {
      amount: this.formData.amount,
      description: this.formData.description,
      category_id: this.formData.category_id,
      record_date: this.formData.record_date,

      payment_status_id:
        this.isCredit
          ? this.pendingStatusId 
          : this.paidStatusId,
      payment_type: (this.isCredit ? 'CREDIT' : 'DEBIT') as 'CREDIT' | 'DEBIT',

      total_installments:
        this.isCredit
          ? this.formData.total_installments || 1
          : 1,
    };

    this.creatingRecord = true;

    this.dashboardService
      .updateRecord(
        this.editingRecord.id,
        payload
      )
      .subscribe({

        next: () => {

          this.creatingRecord = false;

          this.closeCreateModal();

          this.loadDashboard();
          this.loadRecords(this.currentPage);

          this.alert.show(
            'Movimiento actualizado correctamente',
            'success'
          );
        },

        error: (err) => {

          this.creatingRecord = false;

          this.alert.show(
            'Error al actualizar movimiento',
            'error'
          );
        },
      });
  }

  deleteRecord(recordId: number): void {
    this.recordToDelete = recordId;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.recordToDelete = null;
  }

  confirmDelete(): void {

    if (this.recordToDelete === null || this.deletingRecord) {
      return;
    }

    this.deletingRecord = true;

    this.dashboardService
      .deleteRecord(this.recordToDelete)
      .subscribe({

        next: () => {

          this.deletingRecord = false;

          this.closeDeleteModal();

          this.loadDashboard();
          this.loadRecords(this.currentPage);

          this.alert.show(
            'Movimiento eliminado correctamente',
            'success'
          );
        },

        error: (err) => {

          this.deletingRecord = false;

          this.alert.show(
            'Error al eliminar movimiento',
            'error'
          );
        }
      });
  }

  markAsPaid(recordId: number): void {
    if (this.creatingRecord || this.paidStatusId === null) return;
    this.creatingRecord = true;

    this.dashboardService.updateRecord(recordId, { payment_status_id: this.paidStatusId }).subscribe({
      next: () => {
        this.creatingRecord = false;
        this.loadDashboard();
        this.loadRecords(this.currentPage);
        this.alert.show('Movimiento marcado como pagado', 'success');
      },
      error: () => {
        this.creatingRecord = false;
        this.alert.show('Error al actualizar movimiento', 'error');
      }
    });
  }

  loadMoreRecords(): void {
    if (this.recordsData?.next) {
      this.loadRecords(this.currentPage + 1, true);
    }
  }

  // =========================
  // HELPERS
  // =========================

  getSmartDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString + 'T12:00:00');
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const diffMs = today.getTime() - date.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays === -1) return 'Mañana';
    if (diffDays > 1 && diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < -1 && diffDays > -7) return `En ${Math.abs(diffDays)} días`;
    
    return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }

  getPaidPercentage(paidRecords: number, totalRecords: number): number {
    if (totalRecords === 0) return 0;

    return Math.round((paidRecords / totalRecords) * 100);
  }

  toNumber(value: string): number {
    return parseFloat(value);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  }

  getCurrentRecordTypeId(): number | null {
    return this.isExpenses
      ? this.expenseRecordTypeId
      : this.incomeRecordTypeId;
    }

  loadPaymentStatuses(): void {
    this.dashboardService.getPaymentStatuses().subscribe({
      next: (data) => {
        this.paymentStatuses = data;
        
        data.forEach(s => {
          // Normalizamos strings para comparar
          const code = (s.code || '').toLowerCase();
          const status = (s.status || '').toLowerCase();
          
          if (code === 'paid' || status === 'pagado') {
            this.paidStatusId = s.id;
          }
          if (code === 'pending' || status === 'pendiente') {
            this.pendingStatusId = s.id;
          }
        });
      },
      error: (err) => {
        console.error('ERROR CRÍTICO AL CARGAR ESTADOS:', err);
      }
    });
  }
}