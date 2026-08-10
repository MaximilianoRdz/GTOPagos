import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from "./shared/ui/alerts/alerts.component";
import { SidebarComponent } from "./shared/ui/sidebar/sidebar.component";
import { ThemeService } from "./core/services/theme/theme.service";
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertsComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GTOPagos';

  constructor(private themeService: ThemeService, private auth: AuthService) {}

  ngOnInit() {
    this.themeService.initTheme();

    if (this.auth.token) {
      this.auth.validateToken().subscribe();
    }
  }

}
