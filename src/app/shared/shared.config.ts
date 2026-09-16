import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { BadgeComponent } from './ui/atoms/badge/badge.component';
import { ButtonComponent } from './ui/atoms/button/button.component';
import { ProgressBarComponent } from './ui/atoms/progress-bar/progress-bar.component';
import { StatCardComponent } from './ui/molecules/stat-card/stat-card.component';
import { EmptyStateComponent } from './ui/molecules/empty-state/empty-state.component';
import { FinancialAdviceCardComponent } from './ui/molecules/financial-advice-card/financial-advice-card.component';
import { AlertBannerComponent } from './ui/molecules/alert-banner/alert-banner.component';
import { RecordModalComponent } from './ui/organisms/record-modal/record-modal.component';
import { GoalCardComponent } from './ui/organisms/goal-card/goal-card.component';
import { RecordItemComponent } from './ui/organisms/record-item/record-item.component';
import { ImportModalComponent } from './ui/organisms/import-modal/import-modal.component';
import { DashboardCardComponent } from './ui/organisms/dashboard-card/dashboard-card.component';
import { DashboardModalComponent } from './ui/organisms/dashboard-modal/dashboard-modal.component';
import { UpcomingDueModalComponent } from './ui/organisms/upcoming-due-modal/upcoming-due-modal.component';
import { PeriodBudgetWidgetComponent } from './ui/molecules/period-budget-widget/period-budget-widget.component';
import { GoalsSummaryCardComponent } from './ui/molecules/goals-summary-card/goals-summary-card.component';
import { GoalModalComponent } from './ui/organisms/goal-modal/goal-modal.component';
import { AddFundsModalComponent } from './ui/organisms/add-funds-modal/add-funds-modal.component';
import { ReportFiltersComponent } from './ui/organisms/report-filters/report-filters.component';
import { ReportTableComponent } from './ui/organisms/report-table/report-table.component';
import { TourComponent } from './ui/molecules/tour/tour.component';

export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  LucideAngularModule,
  BadgeComponent,
  ButtonComponent,
  ProgressBarComponent,
  StatCardComponent,
  EmptyStateComponent,
  FinancialAdviceCardComponent,
  AlertBannerComponent,
  RecordModalComponent,
  GoalCardComponent,
  RecordItemComponent,
  ImportModalComponent,
  DashboardCardComponent,
  DashboardModalComponent,
  UpcomingDueModalComponent,
  PeriodBudgetWidgetComponent,
  GoalsSummaryCardComponent,
  GoalModalComponent,
  AddFundsModalComponent,
  ReportFiltersComponent,
  ReportTableComponent,
  TourComponent,
];

export {
  BadgeComponent,
  ButtonComponent,
  ProgressBarComponent,
  StatCardComponent,
  EmptyStateComponent,
  FinancialAdviceCardComponent,
  AlertBannerComponent,
  RecordModalComponent,
  GoalCardComponent,
  RecordItemComponent,
  ImportModalComponent,
  DashboardCardComponent,
  DashboardModalComponent,
  UpcomingDueModalComponent,
  PeriodBudgetWidgetComponent,
  GoalsSummaryCardComponent,
  GoalModalComponent,
  AddFundsModalComponent,
  ReportFiltersComponent,
  ReportTableComponent,
  TourComponent,
};