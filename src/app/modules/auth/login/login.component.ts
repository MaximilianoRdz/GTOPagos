import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService, LoginRequest } from '../../../core/services/auth/login.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Lock, EyeClosed, Eye, DollarSign, Sparkles, ArrowRight, Loader2 } from 'lucide-angular';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    LucideAngularModule
],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  readonly Lock = Lock;
  readonly EyeClosed = EyeClosed;
  readonly Eye = Eye;
  readonly DollarSign = DollarSign;
  readonly Sparkles = Sparkles;
  readonly ArrowRight = ArrowRight;
  readonly Loader2 = Loader2;

  form: FormGroup;
  showPassword = signal(false);
  loadingDemo = signal(false);

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
        this.auth.setSession(res.access_token, res.user, res.refresh_token);

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        const msg =
          err.error?.non_field_errors?.[0] ?? 'Credenciales incorrectas';
        this.alert.show(msg, 'error');
      },
    });
  }

  onDemoLogin() {
    if (this.loadingDemo()) return;
    this.loadingDemo.set(true);

    this.loginService.loginAsDemo().subscribe({
      next: (res) => {
        this.auth.setSession(res.access_token, res.user, res.refresh_token);
        this.alert.show('¡Bienvenido al Modo Demo de GTOPagos!', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loadingDemo.set(false);
        const msg = err.error?.detail ?? 'No se pudo iniciar el modo demo. Por favor intenta más tarde.';
        this.alert.show(msg, 'error');
      },
      complete: () => {
        this.loadingDemo.set(false);
      },
    });
  }

}
