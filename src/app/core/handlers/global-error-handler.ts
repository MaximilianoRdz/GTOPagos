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
    const message = (error as Error)?.message || 'Ha ocurrido un error inesperado en la interfaz.';
    console.error('Unhandled Application Error:', error);

    // Run within NgZone to guarantee UI alert triggers without change-detection stalls
    this.zone.run(() => {
      // Notify only if it is a meaningful failure
      if (message && !message.includes('ResizeObserver') && !message.includes('NG0100')) {
        this.alertsService.show('Ocurrió un error inesperado en la vista.', 'error');
      }
    });
  }
}
