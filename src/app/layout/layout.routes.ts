import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { DashboardComponent } from "../modules/dashboard/dashboard.component";
import { ConfigurationComponent } from "../modules/configuration/configuration.component";
import { AuthGuard } from "../core/guards/auth.guard";

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
        path: 'configuration',
        component: ConfigurationComponent,
      },
    ],
  },
];
