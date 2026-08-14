import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Target, Plus, TrendingUp, Calendar, CheckCircle2, ChevronRight, X, Sparkles, DollarSign, Edit, Trash2, PiggyBank, Trophy, CalendarClock } from 'lucide-angular';
import { GoalsService, Goal } from '../../../core/services/goals/goals.service';
import { ConfigurationService, UserProfile } from '../../../core/services/configuration/configuration.service';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { forkJoin } from 'rxjs';

interface ProjectedGoal extends Goal {
  disposableIncome: number;
  monthsToReach: number;
  recommendedSavings: number;
  progressPercentage: number;
}

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './goals.component.html'
})
export class GoalsComponent implements OnInit {
  // Icons
  Target = Target;
  Plus = Plus;
  TrendingUp = TrendingUp;
  Calendar = Calendar;
  CheckCircle2 = CheckCircle2;
  ChevronRight = ChevronRight;
  X = X;
  Sparkles = Sparkles;
  DollarSign = DollarSign;
  Edit = Edit;
  Trash2 = Trash2;
  PiggyBank = PiggyBank;
  Trophy = Trophy;
  CalendarClock = CalendarClock;

  goals: ProjectedGoal[] = [];
  userProfile: UserProfile | null = null;
  totalExpenses: number = 0;
  disposableIncome: number = 0;

  get activeGoals() { return this.goals.filter(g => g.progressPercentage < 100); }
  get completedGoals() { return this.goals.filter(g => g.progressPercentage >= 100); }
  get totalSavedAmount() { return this.goals.reduce((sum, g) => sum + Number(g.saved_amount), 0); }
  activeTab: 'active' | 'completed' = 'active';

  showModal = false;
  editingGoalId: number | null = null;
  deletingGoal = false;
  newGoal: Partial<Goal> = {
    name: '',
    target_amount: 0,
    saved_amount: 0,
    target_date: null
  };

  showAddFundsModal = false;
  addFundsAmount: number | null = null;
  selectedGoalForFunds: Goal | null = null;
  savingFunds = false;

  loading = true;

  constructor(
    private goalsService: GoalsService,
    private configService: ConfigurationService,
    private dashboardService: DashboardService,
    private alert: AlertsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      goals: this.goalsService.getGoals(),
      profile: this.configService.getProfile(),
      dashboard: this.dashboardService.getDashboards()
    }).subscribe({
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
    if (goal) {
      this.editingGoalId = goal.id!;
      this.newGoal = { 
        name: goal.name, 
        target_amount: goal.target_amount, 
        saved_amount: goal.saved_amount,
        target_date: goal.target_date || null
      };
    } else {
      this.editingGoalId = null;
      this.newGoal = { name: '', target_amount: 0, saved_amount: 0, target_date: null };
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingGoalId = null;
  }

  saveGoal() {
    if (!this.newGoal.name || !this.newGoal.target_amount) {
      this.alert.show('Por favor llena todos los campos requeridos', 'error');
      return;
    }

    if (this.editingGoalId) {
      this.goalsService.updateGoal(this.editingGoalId, this.newGoal).subscribe({
        next: (updatedGoal) => {
          const index = this.goals.findIndex(g => g.id === this.editingGoalId);
          if (index !== -1) {
            this.goals[index] = this.calculateProjections(updatedGoal);
          }
          this.alert.show('Meta actualizada exitosamente', 'success');
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.alert.show('Error actualizando la meta', 'error');
        }
      });
    } else {
      this.goalsService.createGoal(this.newGoal).subscribe({
        next: (goal) => {
          this.goals.push(this.calculateProjections(goal));
          this.alert.show('Meta creada exitosamente', 'success');
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.alert.show('Error creando la meta', 'error');
        }
      });
    }
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
          error: (err) => {
            this.alert.show('Error eliminando la meta', 'error');
            this.deletingGoal = false;
          }
        });
      }
    });
  }

  openAddFundsModal(goal: Goal) {
    this.selectedGoalForFunds = goal;
    this.addFundsAmount = null;
    this.showAddFundsModal = true;
  }

  closeAddFundsModal() {
    this.showAddFundsModal = false;
    this.selectedGoalForFunds = null;
    this.addFundsAmount = null;
  }

  saveAddFunds() {
    if (!this.selectedGoalForFunds || !this.addFundsAmount || this.addFundsAmount <= 0) {
      this.alert.show('Ingresa un monto válido a abonar', 'error');
      return;
    }

    this.savingFunds = true;
    const newSavedAmount = Number(this.selectedGoalForFunds.saved_amount) + Number(this.addFundsAmount);

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
      error: (err) => {
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
