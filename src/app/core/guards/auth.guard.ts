import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // No hay token en absoluto
  if (!auth.token) {
    router.navigate(['/login']);
    return false;
  }

  // Si ya tenemos el usuario cargado en memoria, la sesión es válida y activa
  if (auth.user()) {
    return true;
  }

  // Tenemos token pero no usuario (p. ej. recarga de página o abrir el proyecto)
  // Validamos el token contra el backend
  return auth.validateToken().pipe(
    map(() => true),
    catchError(() => {
      auth.clearSession();
      router.navigate(['/login']);
      return of(false);
    })
  );
};
