import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { DashboardComponent } from "../modules/dashboard/dashboard.component";
import { ConfigurationComponent } from "../modules/configuration/configuration.component";
import { AuthGuard } from "../core/guards/auth.guard";
import { BudgetComponent } from "../modules/budget/budget.component";
import { DashboardsComponent } from "../modules/budget/dashboards/pages/dashboards.component";

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'budgets',
        component: DashboardsComponent,
      },
      {
        path: 'budgets/:id',
        component: BudgetComponent,
      },
      {
        path: 'configuration',
        component: ConfigurationComponent,
      },
    ],
  },
];
