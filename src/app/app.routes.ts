import { Routes } from '@angular/router';
import { authRoutes } from './modules/auth/auth.routes';
import { layoutRoutes } from './layout/layout.routes';

export const routes: Routes = [
  ...authRoutes,
  ...layoutRoutes,
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
