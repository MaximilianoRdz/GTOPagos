import { Component, OnDestroy, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../core/services/layout/layout.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { I18nService } from '../../../core/i18n/i18n.service';
import { Subscription, filter } from 'rxjs';
import { LucideAngularModule, DollarSign, Layers, Wallet, Target, ChartColumnDecreasing, User, Settings, LogOut, Menu } from 'lucide-angular';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  route: string;
  hasDropdown?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule ],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnDestroy {
  readonly DollarSign = DollarSign;
  readonly Layers = Layers;
  readonly Wallet = Wallet;
  readonly Target = Target;
  readonly ChartColumnDecreasing = ChartColumnDecreasing;
  readonly User = User;
  readonly Settings = Settings;
  readonly LogOut = LogOut;
  readonly Menu = Menu;

  sidebarOpen = true;
  activeSection = localStorage.getItem('activeSection') ?? 'dashboard';
  private subscription!: Subscription;
  private layoutSub!: Subscription;

  menuItems = computed<MenuItem[]>(() => [
    { id: 'dashboard', label: this.i18n.t().dashboard, icon: this.Layers, hasDropdown: true, route: '/dashboard' },
    { id: 'budgets', label: this.i18n.t().budgets, icon: this.Wallet, route: '/budgets' },
    { id: 'goals', label: this.i18n.t().goals, icon: this.Target, route: '/goals' },
    { id: 'reports', label: this.i18n.t().reports, icon: this.ChartColumnDecreasing, route: '/reports' },
  ]);

  constructor(
    private layoutService: LayoutService, 
    private router: Router, 
    public auth: AuthService, 
    public i18n: I18nService
  ) {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const current = event.urlAfterRedirects.split('/')[1];
        this.activeSection = current;
      });
    
    this.layoutSub = this.layoutService.sidebarOpen$.subscribe(isOpen => {
      this.sidebarOpen = isOpen;
    });
  }

  user = computed(() => this.auth.user());
  
  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  setActiveSection(sectionId: string) {
    const item = this.menuItems().find((m: MenuItem) => m.id === sectionId);
    if (!item) return;

    this.activeSection = sectionId;
    localStorage.setItem('activeSection', sectionId);
    this.router.navigateByUrl(item.route);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.layoutSub?.unsubscribe();
  }

  configuration() {
    this.router.navigateByUrl('/configuration');
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/login']);
  }
}
