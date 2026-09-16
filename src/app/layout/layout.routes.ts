import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { AuthGuard } from "../core/guards/auth.guard";

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import("../modules/dashboard/dashboard.component").then(m => m.DashboardComponent),
      },
      {
        path: 'budgets',
        loadComponent: () => import("../modules/budget/dashboards/pages/dashboards.component").then(m => m.DashboardsComponent),
      },
      {
        path: 'budgets/:id',
        loadComponent: () => import("../modules/budget/budget.component").then(m => m.BudgetComponent),
      },
      {
        path: 'configuration',
        loadComponent: () => import("../modules/configuration/configuration.component").then(m => m.ConfigurationComponent),
      },
      {
        path: 'goals',
        loadComponent: () => import("../modules/goals/pages/goals.component").then(m => m.GoalsComponent),
      },
      {
        path: 'reports',
        loadComponent: () => import("../modules/reports/pages/reports.component").then(m => m.ReportsComponent),
      },
    ],
  },
];
