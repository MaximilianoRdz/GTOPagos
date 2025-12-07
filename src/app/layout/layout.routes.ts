import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { DashboardComponent } from "../modules/dashboard/dashboard.component";
import { ConfigurationComponent } from "../modules/configuration/configuration.component";

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
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
