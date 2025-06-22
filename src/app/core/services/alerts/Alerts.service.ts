import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'info';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  visible = signal(false);
  message = signal('');
  type = signal<AlertType>('info');

  show(message: string, type: AlertType = 'info') {
    this.message.set(message);
    this.type.set(type);
    this.visible.set(true);

    // Oculta la alerta después de 3.5 segundos
    setTimeout(() => this.visible.set(false), 3500);
  }

  hide() {
    this.visible.set(false);
  }
}
