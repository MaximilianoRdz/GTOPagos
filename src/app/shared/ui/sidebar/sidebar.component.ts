import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../core/services/layout/layout.service';
import { Subscription } from 'rxjs';
import { LucideAngularModule, DollarSign, Layers, Wallet, Target, ChartColumnDecreasing, ChevronDown, User,Settings } from 'lucide-angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


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
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnDestroy {
  readonly DollarSign = DollarSign;
  readonly Layers = Layers;
  readonly Wallet = Wallet;
  readonly Target = Target;
  readonly ChartColumnDecreasing = ChartColumnDecreasing;
  readonly ChevronDown = ChevronDown;
  readonly User = User;
  readonly Settings = Settings;

  sidebarOpen = true;
  activeSection = 'dashboard';
  private subscription!: Subscription;

  menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: this.Layers, hasDropdown: true, route: '/dashboard' },
    { id: 'budget', label: 'Presupuesto', icon: this.Wallet, route: '/budget' },
    { id: 'goals', label: 'Metas', icon: this.Target, route: '/goals' },
    { id: 'reports', label: 'Reportes', icon: this.ChartColumnDecreasing, route: '/reports' },
    { id: 'settings', label: 'Configuración', icon: this.Settings, route: '/configuration' },
  ];

  constructor(private layoutService: LayoutService, private router: Router) {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const current = event.urlAfterRedirects.split('/')[1];
        this.activeSection = current;
      });
  }

  setActiveSection(sectionId: string) {
    const item = this.menuItems.find(m => m.id === sectionId);
    if (!item) return;

    this.router.navigateByUrl(item.route);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
