import { Component, signal  } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService, LoginRequest } from '../../../core/services/auth/login.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Lock, EyeClosed, Eye } from 'lucide-angular';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly Lock = Lock;
  readonly EyeClosed = EyeClosed;
  readonly Eye = Eye;

  form: FormGroup;
  showPassword = signal(false);

  constructor(private fb: FormBuilder, private loginService: LoginService, private auth: AuthService, private alert: AlertsService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData: LoginRequest = this.form.value;

    this.loginService.loginUser(formData).subscribe({
      next: (res) => {
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);

        this.alert.show(`Bienvenido ${res.user.name}`, 'success');

        // 🚀 aquí NO seteas el user
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg =
          err.error?.non_field_errors?.[0] ?? 'Credenciales incorrectas';
        this.alert.show(msg, 'error');
      },
    });
  }

}
