import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { LucideAngularModule, Lock, Mail, ChevronLeft, CircleCheck, ArrowLeft, Loader2, KeyRound } from 'lucide-angular';
import { AuthService } from '../../core/services/auth/auth.service';
import { AlertsService } from '../../core/services/alerts/Alerts.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  readonly Lock = Lock;
  readonly Mail = Mail;
  readonly ChevronLeft = ChevronLeft;
  readonly CircleCheck = CircleCheck;
  readonly ArrowLeft = ArrowLeft;
  readonly Loader2 = Loader2;
  readonly KeyRound = KeyRound;

  form: FormGroup;
  isSubmitted = signal(false);
  isLoading = signal(false);
  submittedEmail = signal('');

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alert: AlertsService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.get('email')?.value?.trim().toLowerCase();
    this.isLoading.set(true);

    this.authService.requestPasswordReset(email)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.submittedEmail.set(email);
          this.isSubmitted.set(true);
        },
        error: (err) => {
          console.error('Error solicitando recuperación de contraseña:', err);
          this.alert.show(
            err.error?.email?.[0] || 'Error al procesar la solicitud. Intenta nuevamente.',
            'error'
          );
        },
      });
  }

  retry(): void {
    this.isSubmitted.set(false);
    this.form.reset();
  }
}
