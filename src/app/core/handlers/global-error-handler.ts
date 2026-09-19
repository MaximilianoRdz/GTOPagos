import { ErrorHandler, Injectable, NgZone, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertsService } from '../services/alerts/Alerts.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private alertsService = inject(AlertsService);
  private zone = inject(NgZone);

  handleError(error: unknown): void {
    // HTTP errors are already handled by HTTP interceptors
    if (error instanceof HttpErrorResponse || (error as any)?.rejection instanceof HttpErrorResponse) {
      return;
    }

    // Extract error message safely
    const errObj = error as any;
    const rawMessage = errObj?.message || errObj?.rejection?.message || errObj?.originalError?.message || (typeof error === 'string' ? error : '') || 'Ha ocurrido un error inesperado en la interfaz.';
    const fullErrStr = `${rawMessage} ${String(error)}`;

    // If lazy chunk failed to load due to a new deployment while the tab was idle/open
    const chunkFailedPattern = /Failed to fetch dynamically imported module|Loading chunk [\d]+ failed|Failed to load module script/i;
    if (chunkFailedPattern.test(fullErrStr)) {
      const storageKey = 'gtopagos_chunk_reload_ts';
      const lastReload = sessionStorage.getItem(storageKey);
      const now = Date.now();
      // Guard against infinite reload loops by enforcing a 15-second debounce
      if (!lastReload || now - Number(lastReload) > 15000) {
        sessionStorage.setItem(storageKey, String(now));
        console.warn('Nueva versión detectada o módulo desactualizado. Recargando la aplicación...');
        window.location.reload();
        return;
      }
    }

    console.error('Unhandled Application Error:', error);

    // Run within NgZone to guarantee UI alert triggers without change-detection stalls
    this.zone.run(() => {
      // Notify only if it is a meaningful failure
      if (rawMessage && !rawMessage.includes('ResizeObserver') && !rawMessage.includes('NG0100') && !chunkFailedPattern.test(fullErrStr)) {
        this.alertsService.show('Ocurrió un error inesperado en la vista.', 'error');
      }
    });
  }
}
