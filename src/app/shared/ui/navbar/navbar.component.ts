import { Component, OnDestroy, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LayoutService } from '../../../core/services/layout/layout.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { LucideAngularModule, Menu, ChevronRight, LogOut, Sparkles } from 'lucide-angular';
import { TourService } from '../../../core/services/tour/tour.service';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnDestroy {
  readonly Menu = Menu;
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;
  readonly Sparkles = Sparkles;

  isDemoUser = computed(() => this.auth.user()?.email === 'demo@gtopagos.com');

  monthYear = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  lastAccess = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  currentModule = 'Dashboard';
  private sub!: Subscription;

  private routeMap: Record<string, string> = {
    dashboard: 'Dashboard',
    budgets: 'Presupuesto',
    goals: 'Metas',
    reports: 'Reportes',
    configuration: 'Configuración',
  };

  constructor(
    public layoutService: LayoutService, 
    private auth: AuthService, 
    private router: Router,
    private tourService: TourService
  ) {
    this.sub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const segment = event.urlAfterRedirects.split('/')[1];
        this.currentModule = this.routeMap[segment] ?? 'Dashboard';
      });
  }

  startTour() {
    this.tourService.start(undefined, true);
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
