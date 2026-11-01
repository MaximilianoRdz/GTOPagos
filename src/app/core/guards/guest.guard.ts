import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const GuestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si ya tiene sesión activa con token, redirigir directamente al dashboard
  if (auth.token) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
