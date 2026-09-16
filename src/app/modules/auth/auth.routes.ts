import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('../forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
  },
  {
    path: 'demo',
    loadComponent: () => import('./demo/demo.component').then(m => m.DemoComponent),
  },
];
