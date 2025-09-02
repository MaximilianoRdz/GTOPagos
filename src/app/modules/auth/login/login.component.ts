import { Component, signal  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService, LoginRequest } from '../../../core/services/auth/login.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Lock, EyeClosed, Eye } from 'lucide-angular';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
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

  constructor(private fb: FormBuilder, private loginService: LoginService, private alert: AlertsService) {
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
        console.log('Login exitoso:', res);
        localStorage.setItem('access_token', res.access_token);
        this.alert.show('Login exitoso', 'success');
      },
      error: (err) => {
        console.error('Error al iniciar sesión:', err);
        this.alert.show('Error al iniciar sesión', 'error');
      }
    });
  }
}
