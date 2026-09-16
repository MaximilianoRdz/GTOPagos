import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.config';
import { RecordModalSaveEvent } from '../../shared/ui/organisms/record-modal/record-modal.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { finalize, forkJoin, of, catchError } from 'rxjs';
import { AlertsService } from '../../core/services/alerts/Alerts.service';
import { ConfigurationService, UserProfile, IncomeFrequency } from '../../core/services/configuration/configuration.service';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Plus,
  X,
  Pencil,
  Trash,
  Repeat,
  CreditCard,
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
  changeDetection: ChangeDetectionStrategy.Default,
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
  readonly AlertTriangle = AlertTriangle;
  readonly ChevronRight = ChevronRight;
  readonly ChevronLeft = ChevronLeft;
  readonly Plus = Plus;
  readonly X = X;
  readonly Pencil = Pencil;
  readonly Trash = Trash;
  readonly Repeat = Repeat;
  readonly CreditCard = CreditCard;

  // Tab activo
  activeTab: 'expenses' | 'income' = 'expenses';
  selectedPeriod: 'month' | 'q1' | 'q2' = 'month';
  recordFilter: 'all' | 'pending' | 'msi' | 'recurrent' = 'all';

  // Perfil de usuario y límites de presupuesto
  userProfile: UserProfile | null = null;
  incomeFrequencies: IncomeFrequency[] = [];
  periodLimit: number = 0;
  budgetUsagePercentage: number = 0;
  isNearLimit: boolean = false;
  isOverLimit: boolean = false;
  remainingBudget: number = 0;
  exceededAmount: number = 0;
  totalGlobalExpenses: number = 0;
  isCustomBudget: boolean = false;

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

  creatingRecord = false;
  deletingRecord = false;

  paymentStatuses: PaymentStatus[] = [];

  paidStatusId: number | null = null;
  pendingStatusId: number | null = null;

  constructor(
    private dashboardService: DashboardService,
    private configService: ConfigurationService,
    private route: ActivatedRoute,
    private location: Location,
    public alert: AlertsService
  ) {}

  ngOnInit(): void {
    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.selectedDashboardId = id;

    this.loadUserProfile();
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

  get currentPeriodLabel(): string {
    switch (this.selectedPeriod) {
      case 'q1': return '1ra Quincena';
      case 'q2': return '2da Quincena';
      case 'month': return 'Mes Completo';
      default: return 'Periodo';
    }
  }

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

  get isCreditCardDashboard(): boolean {
    if (!this.selectedDashboard) return false;
    const name = (this.selectedDashboard.name || '').toLowerCase();
    const desc = (this.selectedDashboard.description || '').toLowerCase();
    return (
      name.includes('tarjeta') ||
      name.includes('crédito') ||
      name.includes('credito') ||
      name.includes('credit') ||
      name.includes('bbva') ||
      name.includes('amex') ||
      name.includes('nu') ||
      desc.includes('tarjeta') ||
      desc.includes('crédito') ||
      desc.includes('credito')
    );
  }

  get adviceContext(): 'budget' | 'credit' {
    return this.isCreditCardDashboard ? 'credit' : 'budget';
  }

  get currentTabRecords(): FinancialRecord[] {
    if (!this.recordsData?.results || !this.selectedDashboardId) {
      return [];
    }

    const currentTypeId = this.getCurrentRecordTypeId();

    return this.recordsData.results.filter((record) => {
      const dashMatch = Number(record.dashboard_id) === Number(this.selectedDashboardId);
      if (!dashMatch) return false;

      const typeMatch = this.isExpenses
        ? (currentTypeId && Number(record.record_type_id) === Number(currentTypeId)) || record.record_behavior === 'EXPENSE'
        : (currentTypeId && Number(record.record_type_id) === Number(currentTypeId)) || record.record_behavior === 'INCOME';

      return typeMatch;
    });
  }

  get allCount(): number {
    return this.currentTabRecords.length;
  }

  get pendingCount(): number {
    return this.currentTabRecords.filter((r) => this.isRecordPending(r)).length;
  }

  get msiCount(): number {
    return this.currentTabRecords.filter((r) => this.isRecordMsi(r)).length;
  }

  get recurrentCount(): number {
    return this.currentTabRecords.filter((r) => this.isRecordRecurrent(r)).length;
  }

  isRecordPending(record: FinancialRecord): boolean {
    if (this.pendingStatusId !== null) {
      return Number(record.payment_status_id) === Number(this.pendingStatusId);
    }
    if (this.paidStatusId !== null) {
      return Number(record.payment_status_id) !== Number(this.paidStatusId);
    }
    return false;
  }

  isRecordPaid(record: FinancialRecord): boolean {
    if (this.paidStatusId !== null) {
      return Number(record.payment_status_id) === Number(this.paidStatusId);
    }
    return false;
  }

  isRecordMsi(record: FinancialRecord): boolean {
    const totalInst = Number(record.total_installments || 1);
    return totalInst > 1 || (record.payment_type === 'CREDIT' && totalInst > 1);
  }

  isRecordRecurrent(record: FinancialRecord): boolean {
    return record.is_recurrent === true;
  }

  isRecordExpense(record: FinancialRecord): boolean {
    if (this.expenseRecordTypeId !== null && Number(record.record_type_id) === Number(this.expenseRecordTypeId)) {
      return true;
    }
    return record.record_behavior === 'EXPENSE' || this.isExpenses;
  }

  get filteredRecords(): FinancialRecord[] {
    const records = this.currentTabRecords;

    if (this.recordFilter === 'pending') {
      return records.filter((r) => this.isRecordPending(r));
    }

    if (this.recordFilter === 'msi') {
      return records.filter((r) => this.isRecordMsi(r));
    }

    if (this.recordFilter === 'recurrent') {
      return records.filter((r) => this.isRecordRecurrent(r));
    }

    return records;
  }

  get emptyStateTitle(): string {
    switch (this.recordFilter) {
      case 'pending': return '¡Todo al día!';
      case 'msi': return 'Sin compras a MSI';
      case 'recurrent': return 'Sin movimientos recurrentes';
      default: return 'Todo al día';
    }
  }

  get emptyStateDescription(): string {
    switch (this.recordFilter) {
      case 'pending': return 'No tienes movimientos pendientes en este período. ¡Excelente control!';
      case 'msi': return 'No tienes compras a meses sin intereses en este período.';
      case 'recurrent': return 'No tienes movimientos marcados como recurrentes en este período.';
      default: return 'No tienes movimientos en este período. ¡Excelente control de tus finanzas!';
    }
  }

  get emptyStateIcon(): any {
    switch (this.recordFilter) {
      case 'pending': return this.Clock;
      case 'msi': return this.CreditCard;
      case 'recurrent': return this.Repeat;
      default: return this.CheckCircle;
    }
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
          this.calculateBudgetLimits();
        },
        error: (err) => {
          this.error = 'Error al cargar el dashboard';
          this.loading = false;
        },
      });
  }

  loadUserProfile(): void {
    forkJoin({
      profile: this.configService.getProfile().pipe(catchError(() => of(null))),
      frequencies: this.configService.getIncomeFrequencies().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ profile, frequencies }) => {
        this.userProfile = profile;
        this.incomeFrequencies = frequencies;
        if (this.userProfile && frequencies.length > 0) {
          const freqId = (profile as any)?.income_frequency_id || (profile as any)?.income_frequency?.id;
          if (freqId) {
            this.userProfile.income_frequency = frequencies.find(f => Number(f.id) === Number(freqId)) || null;
          }
        }
        this.calculateBudgetLimits();
      }
    });
  }

  calculateBudgetLimits(): void {
    let salary = 0;
    if (this.userProfile && this.userProfile.salary) {
      salary = Number(this.userProfile.salary);
    }

    let freqName = '';
    if (this.userProfile) {
      if (this.userProfile.income_frequency?.name) {
        freqName = this.userProfile.income_frequency.name.toLowerCase();
      } else {
        const freqId = (this.userProfile as any)?.income_frequency_id;
        if (freqId && this.incomeFrequencies.length > 0) {
          const match = this.incomeFrequencies.find(f => Number(f.id) === Number(freqId));
          if (match) freqName = match.name.toLowerCase();
        }
      }
    }

    // Sueldo base ajustado según frecuencia y período seleccionado
    let baseSalary = 0;
    if (salary > 0) {
      if (freqName.includes('quincen') || freqName.includes('catorcen')) {
        baseSalary = this.selectedPeriod === 'month' ? salary * 2 : salary;
      } else if (freqName.includes('seman')) {
        baseSalary = this.selectedPeriod === 'month' ? salary * 4 : salary * 2;
      } else {
        baseSalary = this.selectedPeriod === 'month' ? salary : salary / 2;
      }
    }

    // Gasto en este espacio específico
    const currentExpense = Number(this.dashboardData?.expense_summary?.total_amount || 0);

    // Gastos en los otros dashboards (excluyendo este espacio)
    const otherDashboardsExpenses = Math.max(0, this.totalGlobalExpenses - currentExpense);

    // OPCIÓN B: ¿Este dashboard tiene un límite / presupuesto mensual propio asignado por el usuario?
    const customBudget = this.selectedDashboard?.monthly_budget != null && Number(this.selectedDashboard.monthly_budget) > 0
      ? Number(this.selectedDashboard.monthly_budget)
      : null;

    if (customBudget !== null) {
      // Tiene presupuesto / límite propio (ej. tarjeta de crédito con línea de $15,000)
      this.isCustomBudget = true;
      this.periodLimit = this.selectedPeriod === 'month' ? customBudget : customBudget / 2;

      const usage = this.periodLimit > 0 ? (currentExpense / this.periodLimit) * 100 : 0;
      this.budgetUsagePercentage = Math.round(usage * 10) / 10;
      this.remainingBudget = Math.max(0, this.periodLimit - currentExpense);
      this.exceededAmount = Math.max(0, currentExpense - this.periodLimit);
      this.isNearLimit = this.budgetUsagePercentage >= 80 && this.budgetUsagePercentage < 100;
      this.isOverLimit = this.budgetUsagePercentage >= 100;
    } else if (baseSalary > 0) {
      // OPCIÓN A: No tiene límite propio -> El límite es lo que realmente tienes DISPONIBLE de tu sueldo
      this.isCustomBudget = false;
      // Tu techo real de gasto para este espacio: sueldo menos lo que ya gastaste en otros dashboards
      this.periodLimit = Math.max(0, baseSalary - otherDashboardsExpenses);

      const usage = this.periodLimit > 0 ? (currentExpense / this.periodLimit) * 100 : 0;
      this.budgetUsagePercentage = Math.round(usage * 10) / 10;
      this.remainingBudget = Math.max(0, this.periodLimit - currentExpense);
      this.exceededAmount = Math.max(0, currentExpense - this.periodLimit);
      this.isNearLimit = this.budgetUsagePercentage >= 80 && this.budgetUsagePercentage < 100;
      this.isOverLimit = this.budgetUsagePercentage >= 100;
    } else {
      this.isCustomBudget = false;
      this.periodLimit = Number(this.dashboardData?.income_summary?.total_amount || 0);
      const usage = this.periodLimit > 0 ? (currentExpense / this.periodLimit) * 100 : 0;
      this.budgetUsagePercentage = Math.round(usage * 10) / 10;
      this.remainingBudget = Math.max(0, this.periodLimit - currentExpense);
      this.exceededAmount = Math.max(0, currentExpense - this.periodLimit);
      this.isNearLimit = this.budgetUsagePercentage >= 80 && this.budgetUsagePercentage < 100;
      this.isOverLimit = this.budgetUsagePercentage >= 100;
    }
  }

  loadDashboardInfo(): void {
    if (!this.selectedDashboardId) return;

    this.dashboardService
      .getDashboards()
      .subscribe({
        next: (dashboards) => {
          this.totalGlobalExpenses = dashboards.reduce(
            (sum, d) => sum + Number(d.total_expense || 0),
            0
          );

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

          this.calculateBudgetLimits();
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

  setFilter(filter: 'all' | 'pending' | 'msi' | 'recurrent'): void {
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
    this.loadCategories(record.record_type_id);
  }

  handleModalSave(event: RecordModalSaveEvent): void {
    if (!this.selectedDashboardId) return;

    if (event.isEditing && event.recordId) {
      this.creatingRecord = true;
      this.dashboardService.updateRecord(event.recordId, event.payload).subscribe({
        next: () => {
          this.creatingRecord = false;
          this.closeCreateModal();
          this.loadDashboard();
          this.loadRecords(this.currentPage);
          this.alert.show('Movimiento actualizado correctamente', 'success');
        },
        error: () => {
          this.creatingRecord = false;
          this.alert.show('Error al actualizar movimiento', 'error');
        },
      });
    } else {
      const recordTypeId = this.getCurrentRecordTypeId();
      if (!recordTypeId) {
        this.alert.show('Los tipos de registros aún están cargando', 'info');
        return;
      }

      const fullPayload: CreateFinancialRecordPayload = {
        ...event.payload as any,
        dashboard_id: this.selectedDashboardId,
        record_type_id: recordTypeId,
      };

      this.creatingRecord = true;
      this.dashboardService.createRecord(fullPayload)
        .pipe(finalize(() => { this.creatingRecord = false; }))
        .subscribe({
          next: () => {
            this.closeCreateModal();
            this.loadDashboard();
            this.loadRecords(1);
            this.alert.show('Movimiento creado correctamente', 'success');
          },
          error: () => {
            this.alert.show('Error al crear movimiento', 'error');
          },
        });
    }
  }

  onValidationError(message: string): void {
    this.alert.show(message, 'info');
  }

  deleteRecord(recordId: number): void {
    if (this.deletingRecord) return;
    this.alert.askConfirm(
      '¿Eliminar movimiento?', 
      `Esta acción eliminará el ${this.currentRecordTypeName.toLowerCase()} permanentemente y no podrá recuperarse.`
    ).then(confirmed => {
      if (confirmed) {
        this.deletingRecord = true;
        this.dashboardService.deleteRecord(recordId).subscribe({
          next: () => {
            this.deletingRecord = false;
            this.loadDashboard();
            this.loadRecords(this.currentPage);
            this.alert.show('Movimiento eliminado correctamente', 'success');
          },
          error: (err) => {
            this.deletingRecord = false;
            this.alert.show('Error al eliminar movimiento', 'error');
            console.error('Error al eliminar movimiento', err);
          }
        });
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