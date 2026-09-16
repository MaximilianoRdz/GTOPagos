import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export type TourModule = 'dashboard' | 'budgets' | 'goals' | 'reports' | 'configuration';

export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  iconName: 'sparkles' | 'wallet' | 'target' | 'barChart' | 'settings' | 'compass' | 'trendingUp';
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  highlightPadding?: number;
  configTab?: 'profile' | 'security' | 'appearance' | 'financial' | 'categories';
}

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private authService = inject(AuthService);
  private router = inject(Router);

  private readonly moduleSteps: Record<TourModule, TourStep[]> = {
    dashboard: [
      {
        id: 'dash-welcome',
        targetSelector: '#tour-welcome',
        title: '1. Resumen y Saludo General',
        description: 'Visualiza el balance general de tu dinero, patrimonio neto y el estado financiero de tus cuentas en tiempo real.',
        iconName: 'sparkles',
        placement: 'bottom',
        highlightPadding: 12
      },
      {
        id: 'dash-stats',
        targetSelector: '#tour-stats',
        title: '2. Métricas Clave (KPIs)',
        description: 'Tarjetas de acceso rápido con tu Balance Neto, Ingresos del Mes, Gastos del Mes y Metas Alcanzadas.',
        iconName: 'wallet',
        placement: 'bottom',
        highlightPadding: 10
      },
      {
        id: 'dash-charts',
        targetSelector: '#tour-charts',
        title: '3. Gráficas Financieras',
        description: 'Evolución de saldos mes a mes y diagrama de dona con la distribución de gastos por categoría.',
        iconName: 'barChart',
        placement: 'top',
        highlightPadding: 10
      },
      {
        id: 'dash-quick-actions',
        targetSelector: '#tour-quick-actions',
        title: '4. Presupuesto y Accesos Rápidos',
        description: 'Consulta el presupuesto disponible de tu periodo y accede directamente a presupuestos, metas o reportes.',
        iconName: 'trendingUp',
        placement: 'left',
        highlightPadding: 10
      },
      {
        id: 'dash-transactions',
        targetSelector: '#tour-transactions',
        title: '5. Historial de Movimientos',
        description: 'Consulta tus transacciones recientes y entra al detalle con filtros por pagos Pendientes, compras a MSI y gastos Recurrentes.',
        iconName: 'sparkles',
        placement: 'top',
        highlightPadding: 10
      }
    ],
    budgets: [
      {
        id: 'budgets-title',
        targetSelector: '#tour-budgets-title',
        title: '1. Mis Espacios de Dinero',
        description: 'Aquí administras todas tus fuentes de dinero: cuentas bancarias, tarjetas de crédito, efectivo o presupuestos específicos.',
        iconName: 'wallet',
        placement: 'bottom',
        highlightPadding: 12
      },
      {
        id: 'budgets-import',
        targetSelector: '#tour-budgets-import',
        title: '2. Importador Inteligente Excel/PDF',
        description: 'Sube tus estados de cuenta bancarios en Excel (.xlsx) o PDF para registrar y categorizar automáticamente tus movimientos.',
        iconName: 'trendingUp',
        placement: 'bottom',
        highlightPadding: 10
      },
      {
        id: 'budgets-create',
        targetSelector: '#tour-budgets-create',
        title: '3. Crear Nuevo Espacio',
        description: 'Crea un nuevo espacio financiero definiendo su nombre, tipo de cuenta, saldo inicial y límite presupuestal.',
        iconName: 'sparkles',
        placement: 'bottom',
        highlightPadding: 10
      },
      {
        id: 'budgets-cards',
        targetSelector: '#tour-budgets-cards',
        title: '4. Tarjetas de Cuenta y Detalle',
        description: 'Consulta el saldo de cada cuenta. Haz clic en cualquiera para ver transacciones detalladas, cuotas a Meses Sin Intereses (MSI) y pagos fijos.',
        iconName: 'wallet',
        placement: 'top',
        highlightPadding: 12
      }
    ],
    goals: [
      {
        id: 'goals-header',
        targetSelector: '#tour-goals-header',
        title: '1. Metas de Ahorro',
        description: 'Establece objetivos de ahorro concretos (viajes, fondo de emergencia, compras) y haz seguimiento a tu progreso.',
        iconName: 'target',
        placement: 'bottom',
        highlightPadding: 12
      },
      {
        id: 'goals-capacity',
        targetSelector: '#tour-goals-capacity',
        title: '2. Capacidad de Ahorro Mensual',
        description: 'El sistema calcula tu dinero disponible real cruzando tu salario registrado contra tus gastos promedio para proyectar tu ahorro.',
        iconName: 'sparkles',
        placement: 'bottom',
        highlightPadding: 12
      },
      {
        id: 'goals-create',
        targetSelector: '#tour-goals-create',
        title: '3. Crear Nueva Meta',
        description: 'Fija el nombre de la meta, monto objetivo, fecha límite y el espacio de dinero asignado.',
        iconName: 'target',
        placement: 'bottom',
        highlightPadding: 10
      },
      {
        id: 'goals-list',
        targetSelector: '#tour-goals-list',
        title: '4. Progreso y Cumplimiento',
        description: 'Revisa tus metas activas y logradas con barras de avance porcentual y estimaciones de tiempo.',
        iconName: 'trendingUp',
        placement: 'top',
        highlightPadding: 12
      }
    ],
    reports: [
      {
        id: 'reports-filters',
        targetSelector: '#tour-reports-filters',
        title: '1. Generador de Reportes',
        description: 'Elige el espacio financiero a consultar y selecciona el mes y año deseado. El sistema calculará el rango exacto.',
        iconName: 'barChart',
        placement: 'bottom',
        highlightPadding: 12
      },
      {
        id: 'reports-kpis',
        targetSelector: '#tour-reports-kpis',
        title: '2. Resumen Ejecutivo (KPIs)',
        description: 'Visualiza de inmediato los totales consolidados: Ingresos Totales, Gastos Totales y Balance Neto del periodo.',
        iconName: 'trendingUp',
        placement: 'bottom',
        highlightPadding: 12
      },
      {
        id: 'reports-table',
        targetSelector: '#tour-reports-table',
        title: '3. Movimientos y Exportación',
        description: 'Revisa cada movimiento con detalle y descarga reportes formales en formato PDF para impresión o en Excel para análisis profundo.',
        iconName: 'wallet',
        placement: 'top',
        highlightPadding: 12
      }
    ],
    configuration: [
      {
        id: 'config-header',
        targetSelector: '#tour-config-header',
        title: '1. Centro de Configuración',
        description: 'Personaliza tu experiencia en GTOPagos, adapta la apariencia y gestiona la seguridad y parámetros de tu cuenta.',
        iconName: 'settings',
        placement: 'bottom',
        highlightPadding: 12
      },
      {
        id: 'config-tabs',
        targetSelector: '#tour-config-tabs',
        title: '2. Navegación de Preferencias',
        description: 'Explora y alterna libremente entre tus 5 secciones: Perfil, Seguridad, Apariencia, Parámetros Financieros y Categorías.',
        iconName: 'compass',
        placement: 'right',
        highlightPadding: 12
      },
      {
        id: 'config-profile',
        targetSelector: '#tour-config-content',
        configTab: 'profile',
        title: '3. Perfil y Datos Personales',
        description: 'Actualiza tus datos de contacto: nombre, apellido y teléfono para personalizar tu cuenta en todo el sistema.',
        iconName: 'sparkles',
        placement: 'auto',
        highlightPadding: 12
      },
      {
        id: 'config-security',
        targetSelector: '#tour-config-content',
        configTab: 'security',
        title: '4. Seguridad y Contraseñas',
        description: 'Gestiona tu clave de acceso. Te recomendamos cambiarla periódicamente para mantener tus finanzas blindadas.',
        iconName: 'settings',
        placement: 'auto',
        highlightPadding: 12
      },
      {
        id: 'config-appearance',
        targetSelector: '#tour-config-content',
        configTab: 'appearance',
        title: '5. Apariencia, Idioma y Guías',
        description: 'Alterna entre Modo Claro y Oscuro, selecciona tu idioma preferido o reinicia los tours interactivos cuando desees repasarlos.',
        iconName: 'sparkles',
        placement: 'auto',
        highlightPadding: 12
      },
      {
        id: 'config-financial',
        targetSelector: '#tour-config-content',
        configTab: 'financial',
        title: '6. Parámetros Financieros',
        description: 'Configura tu moneda predeterminada (MXN, USD, EUR), tu salario base y la frecuencia de tus ingresos (quincenal, mensual).',
        iconName: 'wallet',
        placement: 'auto',
        highlightPadding: 12
      },
      {
        id: 'config-categories',
        targetSelector: '#tour-config-content',
        configTab: 'categories',
        title: '7. Gestión de Categorías',
        description: 'Administra las categorías para clasificar tus gastos e ingresos con colores e iconos, o añade tus propias categorías personalizadas.',
        iconName: 'trendingUp',
        placement: 'auto',
        highlightPadding: 12
      }
    ]
  };

  currentModule = signal<TourModule>('dashboard');
  steps = signal<TourStep[]>(this.moduleSteps.dashboard);
  isActive = signal(false);
  currentStepIndex = signal(0);

  totalSteps = computed(() => this.steps().length);
  currentStep = computed(() => this.steps()[this.currentStepIndex()]);
  isFirstStep = computed(() => this.currentStepIndex() === 0);
  isLastStep = computed(() => this.currentStepIndex() === this.steps().length - 1);
  progressPercentage = computed(() => Math.round(((this.currentStepIndex() + 1) / (this.steps().length || 1)) * 100));

  detectCurrentModule(): TourModule {
    const url = this.router.url.split('?')[0].toLowerCase();
    if (url.includes('budget')) return 'budgets';
    if (url.includes('goal')) return 'goals';
    if (url.includes('report')) return 'reports';
    if (url.includes('configuration')) return 'configuration';
    return 'dashboard';
  }

  private getStorageKey(moduleName: TourModule): string {
    const user = this.authService.user();
    const userId = user?.id || user?.email || 'guest';
    return `gtopagos_tour_${moduleName}_${userId}`;
  }

  hasCompletedTour(moduleName?: TourModule): boolean {
    if (typeof window === 'undefined') return true;
    const mod = moduleName || this.detectCurrentModule();
    return localStorage.getItem(this.getStorageKey(mod)) === 'true';
  }

  checkAndStartAuto(moduleName?: TourModule, delayMs = 1000): void {
    const mod = moduleName || this.detectCurrentModule();
    if (this.hasCompletedTour(mod)) return;

    setTimeout(() => {
      if (!this.isActive() && !this.hasCompletedTour(mod)) {
        this.start(mod);
      }
    }, delayMs);
  }

  start(moduleName?: TourModule, force = false): void {
    const mod = moduleName || this.detectCurrentModule();
    if (!force && this.hasCompletedTour(mod)) return;

    const moduleStepList = this.moduleSteps[mod] || this.moduleSteps.dashboard;
    this.currentModule.set(mod);
    this.steps.set(moduleStepList);
    this.currentStepIndex.set(0);
    this.isActive.set(true);
  }

  next(): void {
    if (this.isLastStep()) {
      this.complete();
    } else {
      this.currentStepIndex.update(i => Math.min(i + 1, this.steps().length - 1));
    }
  }

  prev(): void {
    if (!this.isFirstStep()) {
      this.currentStepIndex.update(i => Math.max(i - 1, 0));
    }
  }

  skip(): void {
    this.complete();
  }

  complete(): void {
    this.isActive.set(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(this.currentModule()), 'true');
    }
  }

  reset(moduleName?: TourModule): void {
    const mod = moduleName || this.detectCurrentModule();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.getStorageKey(mod));
    }
    this.start(mod, true);
  }
}
