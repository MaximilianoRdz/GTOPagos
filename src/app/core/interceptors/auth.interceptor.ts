import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpBackend, HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { AlertsService } from '../services/alerts/Alerts.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environments';
import { LoginResponse } from '../services/auth/login.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const alertsService = inject(AlertsService);
  const httpBackend = inject(HttpBackend);

  const token = authService.token;
  const headers: Record<string, string> = {
    'Bypass-Tunnel-Reminder': 'true',
  };

  // Endpoints públicos de autenticación o acceso que NUNCA deben llevar tokens viejos o caducados
  const isPublicAuthUrl =
    req.url.includes('/demo-login') ||
    req.url.includes('/login') ||
    req.url.includes('/register') ||
    req.url.includes('/forgot-password') ||
    req.url.includes('/reset-password') ||
    req.url.endsWith('/token/');

  if (token && !isPublicAuthUrl) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authReq = req.clone({
    setHeaders: headers,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el servidor indica que no estamos autorizados (Token expirado o inválido)
      if (error.status === 401) {
        const isDemo = authService.isDemo;

        // 🌟 MODO DEMO: Renovación automática y silenciosa sin interrumpir al usuario
        if (isDemo && !req.url.includes('/demo-login')) {
          const directHttp = new HttpClient(httpBackend);
          return directHttp.post<LoginResponse>(`${environment.apiUrl}/demo-login/`, {}).pipe(
            switchMap((res) => {
              authService.setSession(res.access_token, res.user, res.refresh_token, true);
              const retryReq = req.clone({
                setHeaders: {
                  ...headers,
                  'Authorization': `Bearer ${res.access_token}`
                }
              });
              return next(retryReq);
            }),
            catchError((demoErr) => {
              authService.clearSession();
              if (!router.url.includes('/login') && !router.url.includes('/demo')) {
                router.navigate(['/login']);
              }
              return throwError(() => demoErr);
            })
          );
        }

        // Evitamos mostrar "sesión expirada" si el error vino de endpoints de validación inicial o páginas públicas
        const isValidation = req.url.includes('/token/validate');
        const isAuthPage = router.url.includes('/login') || router.url.includes('/demo');

        if (token && !isValidation && !isPublicAuthUrl && !isAuthPage) {
          alertsService.show('Tu sesión ha expirado. Vuelve a iniciar sesión.', 'error');
        }

        // Limpiamos la sesión y redirigimos de forma segura
        authService.clearSession();
        if (!isAuthPage) {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    })
  );
};
