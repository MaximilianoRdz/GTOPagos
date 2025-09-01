import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
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
    }, 2000);
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
