import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../core/services/layout/layout.service';
import { Subscription } from 'rxjs';
import { LucideAngularModule, DollarSign, Layers, Wallet, Target, ChartColumnDecreasing, ChevronDown, User,Settings } from 'lucide-angular';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  hasDropdown?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, LucideAngularModule],
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
    { id: 'dashboard', label: 'Dashboard', icon: this.Layers, hasDropdown: true },
    { id: 'budget', label: 'Presupuesto', icon: this.Wallet },
    { id: 'goals', label: 'Metas', icon: this.Target },
    { id: 'reports', label: 'Reportes', icon: this.ChartColumnDecreasing },
    { id: 'settings', label: 'Configuración', icon: this.Settings }
  ];

  constructor(private layoutService: LayoutService) {
    this.subscription = this.layoutService.sidebarOpen$.subscribe(open => {
      this.sidebarOpen = open;
    });
  }

  setActiveSection(sectionId: string) {
    this.activeSection = sectionId;
    console.log('Sección activa:', sectionId);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
