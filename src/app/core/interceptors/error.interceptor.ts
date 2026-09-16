import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AlertsService } from '../services/alerts/Alerts.service';
import { catchError, retry } from 'rxjs/operators';
import { throwError, timer } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const alertsService = inject(AlertsService);

  return next(req).pipe(
    // Retry once for GET requests on transient network failures
    retry({
      count: req.method === 'GET' ? 1 : 0,
      delay: (err: HttpErrorResponse) => {
        if (err.status === 0 || err.status === 503 || err.status === 504) {
          return timer(1000);
        }
        return throwError(() => err);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      // Status 0: Network error / Offline / CORS rejection
      if (error.status === 0) {
        alertsService.show('Sin conexión a internet o el servidor no responde.', 'error');
      } else if (error.status === 403) {
        alertsService.show('No tienes permisos suficientes para realizar esta acción.', 'error');
      } else if (error.status >= 500) {
        alertsService.show('El servidor presentó una falla temporal. Intenta más tarde.', 'error');
      }

      return throwError(() => error);
    })
  );
};
