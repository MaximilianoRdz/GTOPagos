import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AlertsService } from '../services/alerts/Alerts.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertsService = inject(AlertsService);

  const token = authService.token;
  const headers: Record<string, string> = {
    'Bypass-Tunnel-Reminder': 'true',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authReq = req.clone({
    setHeaders: headers,
  });


  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor indica que no estamos autorizados (Token expirado o inválido)
      if (error.status === 401) {
        
        // Evitamos mostrar "sesión expirada" si el error vino de un intento de Login fallido
        if (token && !req.url.includes('/login')) {
          alertsService.show('Tu sesión ha expirado. Vuelve a iniciar sesión.', 'error');
        }

        // Limpiamos la sesión y redirigimos de forma segura
        authService.clearSession();
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
