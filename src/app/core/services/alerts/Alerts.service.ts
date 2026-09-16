import { Injectable, signal, computed } from '@angular/core';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration: number;
  timerId?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  toasts = signal<ToastItem[]>([]);

  // Backward compatibility signals for legacy references
  visible = computed(() => this.toasts().length > 0);
  message = computed(() => this.toasts()[this.toasts().length - 1]?.message || '');
  type = computed(() => this.toasts()[this.toasts().length - 1]?.type || 'info');

  // Centralized Confirm Modal
  confirmVisible = signal(false);
  confirmTitle = signal('');
  confirmMessage = signal('');
  confirmActionName = signal('Sí, continuar');
  confirmActionStyle = signal<'danger' | 'warning'>('danger');
  private confirmResolve: ((value: boolean) => void) | null = null;

  show(message: string, type: AlertType = 'info', title?: string, duration: number = 3800): string {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const resolvedTitle = title || this.getDefaultTitle(type);

    const timerId = setTimeout(() => {
      this.dismiss(id);
    }, duration);

    const newToast: ToastItem = {
      id,
      type,
      title: resolvedTitle,
      message,
      duration,
      timerId
    };

    // Keep at most 4 simultaneous toasts
    this.toasts.update(current => {
      const updated = [...current, newToast];
      if (updated.length > 4) {
        const removed = updated.shift();
        if (removed?.timerId) clearTimeout(removed.timerId);
      }
      return updated;
    });

    return id;
  }

  success(message: string, title?: string, duration: number = 3800): string {
    return this.show(message, 'success', title, duration);
  }

  error(message: string, title?: string, duration: number = 4500): string {
    return this.show(message, 'error', title, duration);
  }

  warning(message: string, title?: string, duration: number = 4000): string {
    return this.show(message, 'warning', title, duration);
  }

  info(message: string, title?: string, duration: number = 3800): string {
    return this.show(message, 'info', title, duration);
  }

  dismiss(id: string) {
    this.toasts.update(current => {
      const toast = current.find(t => t.id === id);
      if (toast?.timerId) {
        clearTimeout(toast.timerId);
      }
      return current.filter(t => t.id !== id);
    });
  }

  hide() {
    this.clearAll();
  }

  clearAll() {
    this.toasts().forEach(t => {
      if (t.timerId) clearTimeout(t.timerId);
    });
    this.toasts.set([]);
  }

  private getDefaultTitle(type: AlertType): string {
    switch (type) {
      case 'success': return 'Operación exitosa';
      case 'error': return 'Ha ocurrido un error';
      case 'warning': return 'Advertencia';
      case 'info': return 'Información';
    }
  }

  // Confirm Modal
  askConfirm(
    title: string,
    message: string,
    actionName: string = 'Sí, eliminar',
    style: 'danger' | 'warning' = 'danger'
  ): Promise<boolean> {
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
