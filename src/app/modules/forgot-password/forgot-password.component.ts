import { Component, signal, ChangeDetectionStrategy } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Lock, ChevronLeft, CircleCheck } from 'lucide-angular';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  readonly Lock = Lock;
  readonly ChevronLeft = ChevronLeft;
  readonly CircleCheck = CircleCheck;

  form: FormGroup;
  isSubmitted = signal(false);
  isLoading = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [{ value: '', disabled: false }, [Validators.required, Validators.email]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.form.get('email')?.disable(); // desactiva input

    setTimeout(() => {
      this.isLoading.set(false);
      this.isSubmitted.set(true);
    }, 500); // Reducido de 2000 a 500 para mayor velocidad
  }

  retry() {
    this.isSubmitted.set(false);
    this.form.get('email')?.enable(); // re-activa input
    this.form.reset();
  }

  isFormLoading() {
    return this.isLoading();
  }
}
