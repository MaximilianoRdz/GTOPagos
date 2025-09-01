import { Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

export const authRoutes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
  },
  {
    path: 'register',
    component: AuthComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
];
