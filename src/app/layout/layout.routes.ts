import { Routes } from "@angular/router";
import { LayoutComponent } from "./layout.component";
import { DashboardComponent } from "../modules/dashboard/dashboard.component";

export const layoutRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
];
