import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  CreditCard
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  bio: string;
}

interface SecurityData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

interface NotificationSettings {
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  transactionAlerts: boolean;
  paymentReminders: boolean;
}

interface AppearanceSettings {
  theme: string;
  currency: string;
  dateFormat: string;
  numberFormat: string;
  language: string;
  incomeFrequency: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  hasDropdown?: boolean;
}

interface SettingsTab {
  id: Tab;
  label: string;
  icon: any;
}

type Tab = 'profile' | 'security' | 'notifications' | 'appearance' | 'financial';
type NotificationKey = keyof NotificationSettings;

@Component({
  selector: 'app-configuration',
  imports: [CommonModule, LucideAngularModule, FormsModule],
  templateUrl: './configuration.component.html',
})

export class ConfigurationComponent implements OnInit {

  activeSection: string = 'settings';
  activeTab: Tab = 'profile';
  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  theme: string = 'light';

  // Lucide Icons
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

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hasDropdown: true },
    { id: 'budget', label: 'Presupuesto', icon: Wallet },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  settingsTabs: SettingsTab[] = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia e Idioma', icon: Palette },
    { id: 'financial', label: 'Configuración Financiera', icon: CreditCard },
  ];

  profileData: ProfileData = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@email.com',
    phone: '+52 123 456 7890',
    address: 'Guanajuato, México',
    birthDate: '1990-05-15',
    bio: 'Profesional en finanzas personales',
  };

  securityData: SecurityData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
  };

  notificationSettings: NotificationSettings = {
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: false,
    monthlyReports: true,
    transactionAlerts: true,
    paymentReminders: true,
  };

  appearanceSettings: AppearanceSettings = {
    theme: 'light',
    currency: 'MXN',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,234.56',
    language: 'es',
    incomeFrequency: 'monthly',
  };

  themeOptions = [
    { value: 'light', label: 'Claro', icon: Sun, description: 'Tema claro' },
    { value: 'dark', label: 'Oscuro', icon: Moon, description: 'Tema oscuro' },
    { value: 'auto', label: 'Automático', icon: Monitor, description: 'Sigue el sistema' },
  ];

  notificationSettingsConfig: { key: NotificationKey; label: string; description: string }[] = [
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
      description: 'Resumen semanal de tus finanzas'
    },
    {
      key: 'monthlyReports',
      label: 'Reportes mensuales',
      description: 'Análisis detallado mensual'
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

  ngOnInit(): void {
    // Cargar tema desde localStorage al inicializar
    const savedTheme = localStorage.getItem('theme') || 'light';
    this.theme = savedTheme;
    this.appearanceSettings.theme = savedTheme;
    this.applyTheme(savedTheme);
  }

  applyTheme(selectedTheme: string): void {
    const root = document.documentElement;

    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else if (selectedTheme === 'light') {
      root.classList.remove('dark');
    } else if (selectedTheme === 'auto') {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }

  handleThemeChange(newTheme: string): void {
    this.theme = newTheme;
    this.appearanceSettings.theme = newTheme;
    localStorage.setItem('theme', newTheme);
    this.applyTheme(newTheme);
  }

  getActiveLabel(): string {
    const activeItem = this.menuItems.find((item) => item.id === this.activeSection);
    return activeItem ? activeItem.label : 'Dashboard';
  }

  getCurrentMonthYear(): string {
    const now = new Date();
    return now.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
  }

  get isProfileTab(): boolean {
    return this.activeTab === 'profile';
  }

  get isSecurityTab(): boolean {
    return this.activeTab === 'security';
  }

  get isNotificationsTab(): boolean {
    return this.activeTab === 'notifications';
  }


  handleProfileSave(): void {
    console.log('Guardando perfil:', this.profileData);
    // Aquí iría la lógica para guardar el perfil
  }

  handleSecuritySave(): void {
    console.log('Guardando configuración de seguridad:', this.securityData);
    // Aquí iría la lógica para cambiar contraseña
  }

  handleAppearanceSave(): void {
    console.log('Guardando configuración de apariencia:', this.appearanceSettings);
    // Aquí iría la lógica para guardar las preferencias
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }

  setActiveTab(tab: Tab): void {
    this.activeTab = tab;
  }

  togglePasswordVisibility(field: string): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  updateNotificationSetting(key: NotificationKey, value: boolean): void {
    this.notificationSettings[key] = value;
  }
}
