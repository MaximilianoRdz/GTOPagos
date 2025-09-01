import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth',
  imports: [
    LoginComponent,
    RegisterComponent,
    CommonModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  rightPanelActive = false;

  togglePanel(active: boolean) {
    this.rightPanelActive = active;
  }
}
