import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class HapticsService {
  private isNative = Capacitor.isNativePlatform();

  /**
   * Impacto sutil (cambios de pestaña, selecciones rápidas).
   */
  async impactLight(): Promise<void> {
    if (!this.isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Ignorar de forma segura si no está disponible
    }
  }

  /**
   * Impacto medio (apertura de modales, confirmaciones).
   */
  async impactMedium(): Promise<void> {
    if (!this.isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // Ignorar de forma segura si no está disponible
    }
  }

  /**
   * Impacto firme (botones de acción principal).
   */
  async impactHeavy(): Promise<void> {
    if (!this.isNative) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch {
      // Ignorar de forma segura si no está disponible
    }
  }

  /**
   * Notificación háptica de éxito (gasto registrado, meta alcanzada).
   */
  async success(): Promise<void> {
    if (!this.isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch {
      // Ignorar de forma segura si no está disponible
    }
  }

  /**
   * Notificación háptica de advertencia.
   */
  async warning(): Promise<void> {
    if (!this.isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch {
      // Ignorar de forma segura si no está disponible
    }
  }

  /**
   * Notificación háptica de error.
   */
  async error(): Promise<void> {
    if (!this.isNative) return;
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch {
      // Ignorar de forma segura si no está disponible
    }
  }
}
