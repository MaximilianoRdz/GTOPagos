import { Component, OnDestroy, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../core/services/layout/layout.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
  changeDetection: ChangeDetectionStrategy.Eager,
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

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: this.Layers, hasDropdown: true, route: '/dashboard' },
    { id: 'budgets', label: 'Presupuesto', icon: this.Wallet, route: '/budgets' },
    { id: 'goals', label: 'Metas', icon: this.Target, route: '/goals' },
    { id: 'reports', label: 'Reportes', icon: this.ChartColumnDecreasing, route: '/reports' },
  ];

  constructor(private layoutService: LayoutService, private router: Router, public auth: AuthService) {
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
    const item = this.menuItems.find(m => m.id === sectionId);
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
