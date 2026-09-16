import { Component, OnInit, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SHARED_IMPORTS } from '../../../shared/shared.config';
import { Target, Plus, TrendingUp, Sparkles, DollarSign, Trophy } from 'lucide-angular';
import { GoalsService, Goal } from '../../../core/services/goals/goals.service';
import { ConfigurationService, UserProfile } from '../../../core/services/configuration/configuration.service';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';
import { ProjectedGoal } from '../../../shared/models';
import { forkJoin } from 'rxjs';
import { TourService } from '../../../core/services/tour/tour.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: SHARED_IMPORTS,
  templateUrl: './goals.component.html'
})
export class GoalsComponent implements OnInit {
  // Icons
  Target = Target;
  Plus = Plus;
  TrendingUp = TrendingUp;
  Sparkles = Sparkles;
  DollarSign = DollarSign;
  Trophy = Trophy;

  startTour(): void {
    this.tourService.start('goals', true);
  }

  goals: ProjectedGoal[] = [];
  userProfile: UserProfile | null = null;
  totalExpenses: number = 0;
  disposableIncome: number = 0;

  get activeGoals() { return this.goals.filter(g => g.progressPercentage < 100); }
  get completedGoals() { return this.goals.filter(g => g.progressPercentage >= 100); }
  get totalSavedAmount() { return this.goals.reduce((sum, g) => sum + Number(g.saved_amount), 0); }
  activeTab: 'active' | 'completed' = 'active';

  showModal = false;
  editingGoal: Goal | null = null;
  deletingGoal = false;

  showAddFundsModal = false;
  selectedGoalForFunds: Goal | null = null;
  savingFunds = false;

  loading = true;
  private destroyRef = inject(DestroyRef);
  private tourService = inject(TourService);

  constructor(
    private goalsService: GoalsService,
    private configService: ConfigurationService,
    private dashboardService: DashboardService,
    private alert: AlertsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
    this.tourService.checkAndStartAuto('goals', 1000);
  }

  loadData() {
    this.loading = true;
    forkJoin({
      goals: this.goalsService.getGoals(),
      profile: this.configService.getProfile(),
      dashboard: this.dashboardService.getDashboards()
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (res) => {
        this.userProfile = res.profile;
        this.totalExpenses = res.dashboard.reduce((sum, d) => sum + (d.total_expense || 0), 0);
        
        // Calculate disposable income (Salary - Total Monthly Expenses)
        const salary = this.userProfile?.salary || 0;
        this.disposableIncome = salary > 0 ? (salary - this.totalExpenses) : 0;
        // If negative, set to a small positive number to avoid infinite loops, or just 0
        if (this.disposableIncome < 0) this.disposableIncome = 0;

        // Process goals
        this.goals = res.goals.map(g => this.calculateProjections(g));
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.alert.show('Error cargando metas', 'error');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  calculateProjections(goal: Goal): ProjectedGoal {
    const remaining = goal.target_amount - goal.saved_amount;
    let months = 0;
    let rec = 0;
    
    if (remaining > 0) {
      if (goal.target_date) {
        // Calculate months between today and target date
        const target = new Date(goal.target_date);
        const today = new Date();
        const diffTime = target.getTime() - today.getTime();
        const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
        
        if (diffMonths > 0) {
          months = diffMonths;
          rec = remaining / months;
        } else {
          // Date is in the past or this month
          months = 1;
          rec = remaining;
        }
      } else {
        if (this.disposableIncome > 0) {
          // Let's recommend a realistic savings plan (e.g. 30% of disposable income)
          const savingsCapacity = this.disposableIncome * 0.3;
          months = Math.ceil(remaining / savingsCapacity);
          rec = remaining / months;
        } else {
          months = 999; // infinite
          rec = 0;
        }
      }
    }

    const progress = (goal.target_amount > 0) ? (goal.saved_amount / goal.target_amount) * 100 : 0;

    return {
      ...goal,
      disposableIncome: this.disposableIncome,
      monthsToReach: months,
      recommendedSavings: rec,
      progressPercentage: Math.min(100, Math.max(0, progress))
    };
  }

  openModal(goal?: Goal) {
    this.editingGoal = goal || null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingGoal = null;
  }

  onSaveGoal(data: { name: string; target_amount: number; saved_amount: number; target_date: string | null }) {
    if (this.editingGoal && this.editingGoal.id) {
      this.goalsService.updateGoal(this.editingGoal.id, data).subscribe({
        next: (updatedGoal) => {
          const index = this.goals.findIndex(g => g.id === this.editingGoal!.id);
          if (index !== -1) {
            this.goals[index] = this.calculateProjections(updatedGoal);
          }
          this.alert.show('Meta actualizada exitosamente', 'success');
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: () => {
          this.alert.show('Error actualizando la meta', 'error');
        }
      });
    } else {
      this.goalsService.createGoal(data).subscribe({
        next: (goal) => {
          this.goals.push(this.calculateProjections(goal));
          this.alert.show('Meta creada exitosamente', 'success');
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: () => {
          this.alert.show('Error creando la meta', 'error');
        }
      });
    }
  }

  onValidationError(msg: string) {
    this.alert.show(msg, 'error');
  }

  deleteGoal(id: number) {
    if (this.deletingGoal) return;
    this.alert.askConfirm('¿Eliminar meta?', 'Esta acción eliminará la meta permanentemente y no podrá recuperarse.').then(confirmed => {
      if (confirmed) {
        this.deletingGoal = true;
        this.goalsService.deleteGoal(id).subscribe({
          next: () => {
            this.goals = this.goals.filter(g => g.id !== id);
            this.alert.show('Meta eliminada', 'success');
            this.deletingGoal = false;
            this.cdr.detectChanges();
          },
          error: () => {
            this.alert.show('Error eliminando la meta', 'error');
            this.deletingGoal = false;
          }
        });
      }
    });
  }

  openAddFundsModal(goal: Goal) {
    this.selectedGoalForFunds = goal;
    this.showAddFundsModal = true;
  }

  closeAddFundsModal() {
    this.showAddFundsModal = false;
    this.selectedGoalForFunds = null;
  }

  onSaveAddFunds(amount: number) {
    if (!this.selectedGoalForFunds) return;

    this.savingFunds = true;
    const newSavedAmount = Number(this.selectedGoalForFunds.saved_amount) + Number(amount);

    this.goalsService.updateGoal(this.selectedGoalForFunds.id!, { saved_amount: newSavedAmount }).subscribe({
      next: (updatedGoal) => {
        const index = this.goals.findIndex(g => g.id === this.selectedGoalForFunds!.id);
        if (index !== -1) {
          this.goals[index] = this.calculateProjections(updatedGoal);
        }
        
        if (updatedGoal.saved_amount >= updatedGoal.target_amount) {
          this.alert.show('¡Felicidades! Has completado tu meta 🎉', 'success');
        } else {
          this.alert.show('Abono registrado correctamente', 'success');
        }

        this.savingFunds = false;
        this.closeAddFundsModal();
        this.cdr.detectChanges();
      },
      error: () => {
        this.alert.show('Error al registrar el abono', 'error');
        this.savingFunds = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatCurrency(val: number) {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  }
}
