import { Component, ChangeDetectorRef, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { SHARED_IMPORTS } from '../../shared/shared.config';
import { ConfigurationService, Currency, IncomeFrequency, UserProfile } from '../../core/services/configuration/configuration.service';
import {
  User,
  Shield,
  Palette,
  CreditCard,
  Tags,
  Sparkles,
} from 'lucide-angular';
import { I18nService } from '../../core/i18n/i18n.service';
import { AlertsService } from '../../core/services/alerts/Alerts.service';
import { TourService } from '../../core/services/tour/tour.service';
import { DashboardService, Category, FinancialRecordType } from '../../core/services/dashboard/dashboard.service';
import { ProfileSettingsComponent, ProfileData } from './components/profile-settings/profile-settings.component';
import { SecuritySettingsComponent, SecurityData } from './components/security-settings/security-settings.component';
import { AppearanceSettingsComponent, AppTheme } from './components/appearance-settings/appearance-settings.component';
import { FinancialSettingsComponent } from './components/financial-settings/financial-settings.component';
import { CategoriesSettingsComponent } from './components/categories-settings/categories-settings.component';

/* ===================== INTERFACES ===================== */

interface AppearanceSettings {
  theme: AppTheme;
  language: string;
}

type Tab = 'profile' | 'security' | 'appearance' | 'financial' | 'categories';

/* ===================== COMPONENT ===================== */

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [
    ...SHARED_IMPORTS,
    ProfileSettingsComponent,
    SecuritySettingsComponent,
    AppearanceSettingsComponent,
    FinancialSettingsComponent,
    CategoriesSettingsComponent,
  ],
  templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit {
  constructor(
    public i18n: I18nService,
    private configService: ConfigurationService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private alert: AlertsService,
    private router: Router,
    private tourService: TourService
  ) {
    effect(() => {
      const step = this.tourService.currentStep();
      if (step?.configTab && this.activeTab !== step.configTab) {
        this.setActiveTab(step.configTab as Tab);
        this.cdr.detectChanges();
      }
    });
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme') as AppTheme | null;
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
    this.tourService.checkAndStartAuto('configuration', 1000);
  }

  /* ===================== STATE ===================== */

  readonly Sparkles = Sparkles;

  startTour(): void {
    this.tourService.start('configuration', true);
  }

  activeTab: Tab = 'profile';

  settingsTabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Seguridad', icon: Shield },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'financial', label: 'Configuración Financiera', icon: CreditCard },
    { id: 'categories', label: 'Categorías', icon: Tags },
  ];

  /* ===================== DATA ===================== */

  profileData: ProfileData = {
    firstName: '',
    lastName: '',
    phone: '',
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
  loadingSecurity = false;
  loadingFinancial = false;

  currencies: Currency[] = [];
  incomeFrequencies: IncomeFrequency[] = [];

  /* ===================== CATEGORIES STATE ===================== */
  categories: Category[] = [];
  recordTypes: FinancialRecordType[] = [];
  loadingCategories = false;
  showNewCategoryModal = false;
  creatingCategory = false;

  /* ===================== GETTERS (TABS) ===================== */

  get isProfileTab() {
    return this.activeTab === 'profile';
  }

  get isSecurityTab() {
    return this.activeTab === 'security';
  }

  get isAppearanceTab() {
    return this.activeTab === 'appearance';
  }

  get isFinancialTab() {
    return this.activeTab === 'financial';
  }

  get isCategoriesTab() {
    return this.activeTab === 'categories';
  }

  /* ===================== TAB SELECTION ===================== */

  setActiveTab(tab: Tab): void {
    this.activeTab = tab;
    if (tab === 'categories') {
      if (!this.categories.length) this.loadCategories();
      if (!this.recordTypes.length) this.loadRecordTypes();
    }
  }

  /* ===================== API LOADERS ===================== */

  loadCurrencies(): void {
    this.configService.getCurrencies().subscribe({
      next: (data) => {
        this.currencies = data;

        if (!this.userProfile.currency && data.length) {
          const mxn = data.find(c => c.code === 'MXN');
          if (mxn) {
            this.userProfile.currency = mxn;
          }
        } else if (!this.userProfile.currency && (this.userProfile as any)._temp_currency_id) {
          this.userProfile.currency = data.find(c => c.id === (this.userProfile as any)._temp_currency_id) ?? null;
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando monedas', err),
    });
  }

  loadIncomeFrequencies(): void {
    this.configService.getIncomeFrequencies().subscribe({
      next: (data) => {
        this.incomeFrequencies = data;

        if (!this.userProfile.income_frequency && (this.userProfile as any)._temp_frequency_id) {
          this.userProfile.income_frequency = data.find(f => f.id === (this.userProfile as any)._temp_frequency_id) ?? null;
        }

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando frecuencias de ingreso', err),
    });
  }

  loadUserProfile(): void {
    this.loadingProfile = true;

    this.configService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;

        this.profileData.phone = profile.phone ?? '';
        this.profileData.firstName = profile.first_name ?? '';
        this.profileData.lastName = profile.last_name ?? '';

        const currencyId = (profile as any).currency_id;
        (this.userProfile as any)._temp_currency_id = currencyId;
        if (this.currencies.length) {
          this.userProfile.currency = this.currencies.find(c => c.id === currencyId) ?? null;
        }

        const frequencyId = (profile as any).income_frequency_id;
        (this.userProfile as any)._temp_frequency_id = frequencyId;
        if (this.incomeFrequencies.length) {
          this.userProfile.income_frequency = this.incomeFrequencies.find(f => f.id === frequencyId) ?? null;
        }
        this.loadingProfile = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingProfile = false;
      },
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.dashboardService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando categorías', err);
        this.loadingCategories = false;
      }
    });
  }

  loadRecordTypes(): void {
    this.dashboardService.getRecordTypes().subscribe({
      next: (types) => {
        this.recordTypes = types;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando tipos de movimiento', err),
    });
  }

  /* ===================== PROFILE ACTIONS ===================== */

  handleProfileSave(data?: ProfileData): void {
    const d = data || this.profileData;
    const payload: any = {};

    if (d.firstName?.trim()) {
      payload.first_name = d.firstName.trim();
    }

    if (d.lastName?.trim()) {
      payload.last_name = d.lastName.trim();
    }

    if (d.phone?.trim()) {
      payload.phone = d.phone.trim();
    }

    if (!Object.keys(payload).length) return;

    this.loadingProfile = true;
    this.configService.updateProfile(payload).subscribe({
      next: () => {
        this.loadingProfile = false;
        this.alert.show('Información personal actualizada', 'success');
        this.loadUserProfile();
      },
      error: () => {
        this.loadingProfile = false;
        this.alert.show('Error al actualizar información', 'error');
      }
    });
  }

  /* ===================== SECURITY ACTIONS ===================== */

  handleSecuritySave(data: SecurityData): void {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      this.alert.show('Completa todos los campos de contraseña', 'error');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      this.alert.show('Las contraseñas no coinciden', 'error');
      return;
    }

    const payload = {
      current_password: data.currentPassword,
      new_password: data.newPassword,
      confirm_password: data.confirmPassword,
    };

    this.loadingSecurity = true;
    this.configService.changePassword(payload).subscribe({
      next: () => {
        this.loadingSecurity = false;
        this.alert.show('Contraseña actualizada correctamente', 'success');
        data.currentPassword = '';
        data.newPassword = '';
        data.confirmPassword = '';
      },
      error: (err) => {
        this.loadingSecurity = false;
        console.error('Error cambiando contraseña', err);
        const errorMsg = err.error?.confirm_password?.[0] || err.error?.current_password?.[0] || err.error?.new_password?.[0] || 'Error al cambiar la contraseña';
        this.alert.show(errorMsg, 'error');
      }
    });
  }

  /* ===================== APPEARANCE ACTIONS ===================== */

  setTheme(theme: AppTheme): void {
    this.appearanceSettings.theme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: AppTheme): void {
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

  setLanguage(lang: string): void {
    const validLang = lang === 'en' ? 'en' : 'es';
    this.appearanceSettings.language = validLang;
    this.i18n.setLanguage(validLang);
    localStorage.setItem('language', validLang);
  }

  restartTour(): void {
    this.tourService.reset('configuration');
    this.alert.show('Iniciando guía interactiva de configuración...', 'success');
  }

  /* ===================== FINANCIAL ACTIONS ===================== */

  handleFinancialSave(profile?: UserProfile): void {
    const p = profile || this.userProfile;
    const payload = {
      salary: p.salary ?? null,
      currency_id: p.currency?.id ?? null,
      income_frequency_id: p.income_frequency?.id ?? null,
    };

    this.loadingFinancial = true;
    this.configService.updateProfile(payload).subscribe({
      next: (updatedProfile) => {
        this.loadingFinancial = false;
        this.userProfile.salary = updatedProfile.salary;
        this.alert.show('Perfil financiero actualizado', 'success');
      },
      error: (err) => {
        this.loadingFinancial = false;
        console.error('Error actualizando perfil', err);
        this.alert.show('Error al actualizar perfil financiero', 'error');
      },
    });
  }

  /* ===================== CATEGORIES ACTIONS ===================== */

  handleCreateCategory(data: { name: string; record_type_id: number; color: string }): void {
    this.creatingCategory = true;
    this.dashboardService.createCategory({
      name: data.name.trim(),
      record_type_id: Number(data.record_type_id),
      color: data.color
    }).subscribe({
      next: (cat) => {
        this.alert.show(`Categoría "${cat.name}" creada con éxito`, 'success');
        this.showNewCategoryModal = false;
        this.creatingCategory = false;
        this.loadCategories();
      },
      error: (err) => {
        this.creatingCategory = false;
        const msg = err.error?.detail || err.error?.name?.[0] || 'Error al crear la categoría';
        this.alert.show(msg, 'error');
      }
    });
  }

  async handleDeleteCategory(cat: Category): Promise<void> {
    if (!cat.is_custom) {
      this.alert.show('No puedes eliminar categorías predeterminadas del sistema', 'error');
      return;
    }

    const confirmed = await this.alert.askConfirm(
      '¿Eliminar categoría?',
      `¿Estás seguro de eliminar la categoría "${cat.name}"?`,
      'Eliminar',
      'danger'
    );

    if (confirmed) {
      this.dashboardService.deleteCategory(cat.id).subscribe({
        next: () => {
          this.alert.show('Categoría eliminada con éxito', 'success');
          this.loadCategories();
        },
        error: (err) => {
          const msg = err.error?.detail || 'No se pudo eliminar la categoría';
          this.alert.show(msg, 'error');
        }
      });
    }
  }

  handleValidationError(msg: string): void {
    this.alert.show(msg, 'error');
  }
}
