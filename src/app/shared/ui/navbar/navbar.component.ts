import { Component } from '@angular/core';
import { LayoutService } from '../../../core/services/layout/layout.service';
import { LucideAngularModule, Menu, ChevronRight , LogOut } from 'lucide-angular';
@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  readonly Menu = Menu;
  readonly LogOut = LogOut;
  readonly ChevronRight  = ChevronRight ;

  monthYear = new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  lastAccess = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  constructor(public layoutService: LayoutService) {}

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }
}
