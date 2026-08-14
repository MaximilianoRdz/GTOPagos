import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'info';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  visible = signal(false);
  message = signal('');
  type = signal<AlertType>('info');

  // Modal Confirmación Centralizado
  confirmVisible = signal(false);
  confirmTitle = signal('');
  confirmMessage = signal('');
  confirmActionName = signal('Sí, eliminar');
  confirmActionStyle = signal<'danger' | 'warning'>('danger');
  private confirmResolve: ((value: boolean) => void) | null = null;

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

  askConfirm(title: string, message: string, actionName: string = 'Sí, eliminar', style: 'danger' | 'warning' = 'danger'): Promise<boolean> {
    this.confirmTitle.set(title);
    this.confirmMessage.set(message);
    this.confirmActionName.set(actionName);
    this.confirmActionStyle.set(style);
    this.confirmVisible.set(true);

    return new Promise(resolve => {
      this.confirmResolve = resolve;
    });
  }

  resolveConfirm(result: boolean) {
    this.confirmVisible.set(false);
    if (this.confirmResolve) {
      this.confirmResolve(result);
      this.confirmResolve = null;
    }
  }
}
