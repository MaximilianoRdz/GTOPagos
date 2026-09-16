import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import {
  LucideAngularModule,
  Lock,
  Eye,
  EyeClosed,
  CheckCircle2,
  CircleAlert,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  readonly Lock = Lock;
  readonly Eye = Eye;
  readonly EyeClosed = EyeClosed;
  readonly CheckCircle2 = CheckCircle2;
  readonly CircleAlert = CircleAlert;
  readonly Loader2 = Loader2;
  readonly ArrowRight = ArrowRight;
  readonly ShieldCheck = ShieldCheck;

  form: FormGroup;
  uid: string | null = null;
  token: string | null = null;

  hasValidParams = signal(true);
  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal<string | null>(null);

  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private alert: AlertsService
  ) {
    this.form = this.fb.group(
      {
        new_password: ['', [Validators.required, Validators.minLength(8)]],
        confirm_password: ['', [Validators.required, Validators.minLength(8)]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.uid = this.route.snapshot.queryParamMap.get('uid');
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.uid || !this.token) {
      this.hasValidParams.set(false);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('new_password')?.value;
    const confirm = form.get('confirm_password')?.value;
    if (password && confirm && password !== confirm) {
      form.get('confirm_password')?.setErrors({ mismatch: true });
    }
    return null;
  }

  get hasMinLength(): boolean {
    const val = this.form.get('new_password')?.value || '';
    return val.length >= 8;
  }

  get passwordsMatch(): boolean {
    const p1 = this.form.get('new_password')?.value;
    const p2 = this.form.get('confirm_password')?.value;
    return !!p1 && !!p2 && p1 === p2;
  }

  toggleNewPassword(): void {
    this.showNewPassword.update((v) => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update((v) => !v);
  }

  onSubmit(): void {
    if (this.form.invalid || !this.uid || !this.token) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const payload = {
      uid: this.uid,
      token: this.token,
      new_password: this.form.get('new_password')?.value,
      confirm_password: this.form.get('confirm_password')?.value,
    };

    this.authService
      .confirmPasswordReset(payload)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.isSuccess.set(true);
          this.alert.show('¡Contraseña restablecida exitosamente!', 'success');
        },
        error: (err) => {
          console.error('Error al restablecer contraseña:', err);
          const errorMsg =
            err.error?.token?.[0] ||
            err.error?.new_password?.[0] ||
            err.error?.confirm_password?.[0] ||
            'El enlace de recuperación es inválido o ha expirado. Por favor solicita uno nuevo.';
          this.errorMessage.set(errorMsg);
          this.alert.show(errorMsg, 'error');
        },
      });
  }
}
