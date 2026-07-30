import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfigurationService, Currency, IncomeFrequency } from '../../core/services/configuration/configuration.service';
import {
  LucideAngularModule,
  DollarSign,
  Menu,
  User,
  Eye,
  EyeOff,
  Save,
  Mail,
  Phone,
  Shield,
  Sun,
  Moon,
  Monitor,
  LayoutDashboard,
  Wallet,
  Target,
  BarChart3,
  Settings,
  Bell,
  Palette,
  CreditCard,
} from 'lucide-angular';
import { I18nService } from '../../core/i18n/i18n.service';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

/* ===================== INTERFACES ===================== */

interface ProfileData {
  firstName: string;
  lastName: string;
  phone: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

export type NotificationMethod = 'email' | 'sms' | 'both';

interface NotificationSettings {
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  transactionAlerts: boolean;
  paymentReminders: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

interface UserProfile {
  firstName?: string | null;
  lastName?: string | null;
  currency: Currency | null;
  salary: number | null;
  income_frequency: IncomeFrequency | null;
  phone?: string | null;
}


interface MenuItem {
  id: string;
  label: string;
  icon: any;
  hasDropdown?: boolean;
}

type Tab = 'profile' | 'security' | 'notifications' | 'appearance' | 'financial';
type NotificationKey = keyof NotificationSettings;

/* ===================== COMPONENT ===================== */

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [LucideAngularModule, FormsModule, CommonModule, InputTextModule, SelectModule],
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent {

  constructor(public i18n: I18nService, private configService: ConfigurationService) {}

  loadProfile(): void {
    this.configService.getProfile().subscribe(profile => {
      if (profile?.phone) {
        this.profileData.phone = profile.phone;
      }
    });
  }


  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    const savedLang = localStorage.getItem('language') as 'es' | 'en' | null;
    
    if (savedTheme) {
      this.appearanceSettings.theme = savedTheme;
      this.applyTheme(savedTheme);
    }
    if (savedLang) {
      this.appearanceSettings.language = savedLang;
    }

    this.loadCurrencies();
    this.loadIncomeFrequencies();
    this.loadUserProfile();

  }

  /* ===================== STATE ===================== */

  activeSection: string = 'settings';
  activeTab: Tab = 'profile';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  /* ===================== ICONS ===================== */

  DollarSign = DollarSign;
  Menu = Menu;
  User = User;
  Eye = Eye;
  EyeOff = EyeOff;
  Save = Save;
  Mail = Mail;
  Phone = Phone;
  Shield = Shield;
  Sun = Sun;
  Moon = Moon;
  Monitor = Monitor;
  Settings = Settings;

  /* ===================== MENU ===================== */

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'budget', label: 'Presupuesto', icon: Wallet },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  settingsTabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia e Idioma', icon: Palette },
    { id: 'financial', label: 'Configuración Financiera', icon: CreditCard },
  ];


  /* ===================== DATA ===================== */

  profileData: ProfileData = {
    firstName: '',
    lastName: '',
    phone: '',
  };

  securityData: SecurityData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  };

  // Método de notificación
  notificationMethod: NotificationMethod = 'email';

  notificationSettings: NotificationSettings = {
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: false,
    monthlyReports: true,
    transactionAlerts: true,
    paymentReminders: true,
  };

  appearanceSettings: AppearanceSettings = {
    theme: 'auto',
    language: 'es',
  };

  userProfile: UserProfile = {
    firstName: '',
    lastName: '',
    currency: null,
    salary: null,
    income_frequency: null,
    phone: '',
  };

  loadingProfile = false;

  themeOptions = [
    {
      value: 'light' as const,
      label: 'Claro',
      icon: Sun,
      description: 'Tema claro',
      color: 'text-yellow-500',
    },
    {
      value: 'dark' as const,
      label: 'Oscuro',
      icon: Moon,
      description: 'Tema oscuro',
      color: 'text-indigo-500',
    },
    {
      value: 'auto' as const,
      label: 'Automático',
      icon: Monitor,
      description: 'Sigue el sistema',
      color: 'text-gray-500',
    },
  ];

  notificationOptions: {
  key: NotificationKey;
  label: string;
  description: string;
  }[] = [
    {
      key: 'budgetAlerts',
      label: 'Alertas de presupuesto',
      description: 'Te avisamos cuando te acerques al límite',
    },
    {
      key: 'goalReminders',
      label: 'Recordatorios de metas',
      description: 'Recordatorios para cumplir tus objetivos',
    },
    {
      key: 'weeklyReports',
      label: 'Reportes semanales',
      description: 'Resumen semanal de tus finanzas',
    },
    {
      key: 'monthlyReports',
      label: 'Reportes mensuales',
      description: 'Análisis detallado mensual',
    },
    {
      key: 'transactionAlerts',
      label: 'Alertas de transacciones',
      description: 'Notificaciones de nuevas transacciones',
    },
    {
      key: 'paymentReminders',
      label: 'Recordatorios de pagos',
      description: 'Recordatorios de pagos pendientes',
    },
  ];

  currencies: Currency[] = [];

  incomeFrequencies: IncomeFrequency[] = [];


  /* ===================== LIFECYCLE ===================== */



  /* ===================== GETTERS (TABS) ===================== */

  get isProfileTab() {
    return this.activeTab === 'profile';
  }

  get isSecurityTab() {
    return this.activeTab === 'security';
  }

  get isNotificationsTab() {
    return this.activeTab === 'notifications';
  }

  get isAppearanceTab() {
    return this.activeTab === 'appearance';
  }

  get isFinancialTab() {
    return this.activeTab === 'financial';
  }

  /* ===================== ACTIONS ===================== */

  setActiveTab(tab: Tab): void {
    this.activeTab = tab;
  }

  updateNotificationSetting(key: NotificationKey, value: boolean): void {
    this.notificationSettings[key] = value;
  }

  setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.appearanceSettings.theme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: 'light' | 'dark' | 'auto'): void {
    const root = document.documentElement;

    if (theme === 'light') {
      root.classList.remove('dark');
    }

    if (theme === 'dark') {
      root.classList.add('dark');
    }

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }
  }

  setLanguage(lang: 'es' | 'en') {
    this.appearanceSettings.language = lang;
    this.i18n.setLanguage(lang);
    localStorage.setItem('language', lang);
  }

  formatPhone(value: string) {
    const numbers = value.replace(/\D/g, '').slice(0, 10);

    if (numbers.length <= 3) {
      this.profileData.phone = numbers;
    } else if (numbers.length <= 6) {
      this.profileData.phone = `${numbers.slice(0, 3)} ${numbers.slice(3)}`;
    } else {
      this.profileData.phone = `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6)}`;
    }
  }

  handleProfileSave(): void {
    const payload: any = {};

    if (this.profileData.firstName?.trim()) {
      payload.first_name = this.profileData.firstName.trim();
    }

    if (this.profileData.lastName?.trim()) {
      payload.last_name = this.profileData.lastName.trim();
    }

    if (this.profileData.phone?.trim()) {
      payload.phone = this.profileData.phone.trim();
    }

    if (!Object.keys(payload).length) return;

    this.configService.updateProfile(payload).subscribe();
  }


  handleSecuritySave(): void {
    if (!this.securityData.currentPassword ||
        !this.securityData.newPassword ||
        !this.securityData.confirmPassword) {
      return;
    }

    if (this.securityData.newPassword !== this.securityData.confirmPassword) {
      console.error('Las contraseñas no coinciden');
      return;
    }

    const payload = {
      current_password: this.securityData.currentPassword,
      new_password: this.securityData.newPassword,
      confirm_password: this.securityData.confirmPassword,
    };

    this.configService.changePassword(payload).subscribe({
      next: () => {
        console.log('Contraseña actualizada correctamente');

        // Limpiar campos
        this.securityData.currentPassword = '';
        this.securityData.newPassword = '';
        this.securityData.confirmPassword = '';
      },
      error: (err) => {
        console.error('Error cambiando contraseña', err);
      }
    });
  }


  handleFinancialSave(): void {
    const payload = {
      salary: this.userProfile.salary ?? null,
      currency_id: this.userProfile.currency?.id ?? null,
      income_frequency_id: this.userProfile.income_frequency?.id ?? null,
    };

    this.configService.updateProfile(payload).subscribe({
      next: (updatedProfile) => {
        // Mantener objetos completos si quieres mostrar
        this.userProfile.salary = updatedProfile.salary;
        // Opcional: podrías volver a cargar profile desde backend si necesitas los objetos currency y frequency
        console.log('Perfil financiero actualizado');
      },
      error: (err) => {
        console.error('Error actualizando perfil', err);
      },
    });
  }

  loadCurrencies(): void {
    this.configService.getCurrencies().subscribe({
      next: (data) => {
        this.currencies = data;

        // seleccionar MXN por defecto si no hay moneda aún
        if (!this.userProfile.currency && data.length) {
          const mxn = data.find(c => c.code === 'MXN');
          if (mxn) {
            this.userProfile.currency = mxn;
          }
        }
      },
      error: (err) => console.error('Error cargando monedas', err),
    });
  }

  loadIncomeFrequencies(): void {
    this.configService.getIncomeFrequencies().subscribe({
      next: (data) => {
        this.incomeFrequencies = data;
      },
      error: (err) => console.error('Error cargando frecuencias de ingreso', err),
    });
  }

  loadUserProfile(): void {
    this.loadingProfile = true;

    this.configService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;

        // Perfil básico
        this.profileData.phone = profile.phone ?? '';
        this.profileData.firstName = profile.first_name ?? '';
        this.profileData.lastName = profile.last_name ?? '';

        // ---- Currency ----
        const currencyId = profile.currency?.id;

        if (this.currencies.length && currencyId) {
          this.userProfile.currency =
            this.currencies.find(c => c.id === currencyId) ?? null;
        } else {
          this.userProfile.currency = null;
        }

        // ---- Income frequency ----
        const frequencyId = profile.income_frequency?.id;

        if (this.incomeFrequencies.length && frequencyId) {
          this.userProfile.income_frequency =
            this.incomeFrequencies.find(f => f.id === frequencyId) ?? null;
        } else {
          this.userProfile.income_frequency = null;
        }

        this.loadingProfile = false;
      },
      error: () => {
        this.loadingProfile = false;
      },
    });
  }


}
