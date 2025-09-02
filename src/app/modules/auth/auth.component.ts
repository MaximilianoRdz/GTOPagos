import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LucideAngularModule, DollarSign, ChartNoAxesCombined } from 'lucide-angular';

@Component({
  selector: 'app-auth',
  imports: [
    LoginComponent,
    RegisterComponent,
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  readonly DollarSign = DollarSign;
  readonly ChartNoAxesCombined = ChartNoAxesCombined;

  rightPanelActive = false;

  togglePanel(active: boolean) {
    this.rightPanelActive = active;
  }
}
