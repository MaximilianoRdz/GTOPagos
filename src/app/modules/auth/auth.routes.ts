import { Routes } from '@angular/router';
import { GuestGuard } from '../../core/guards/guest.guard';

export const authRoutes: Routes = [
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'register',
    canActivate: [GuestGuard],
    loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [GuestGuard],
    loadComponent: () => import('../forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: 'demo',
    canActivate: [GuestGuard],
    loadComponent: () => import('./demo/demo.component').then(m => m.DemoComponent),
  },
];
