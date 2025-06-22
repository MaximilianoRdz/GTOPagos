import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AlertsComponent } from "./shared/ui/alerts/alerts.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AlertsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'GTOPagos';
}
