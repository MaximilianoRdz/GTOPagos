import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Ya validado
  if (auth.isAuthenticated()) {
    return true;
  }

  // No hay token
  if (!auth.token) {
    router.navigate(['/login']);
    return false;
  }

  // Validar token con backend
  return auth.validateToken().pipe(
    map(() => true),
    catchError(() => {
      auth.clearSession();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
