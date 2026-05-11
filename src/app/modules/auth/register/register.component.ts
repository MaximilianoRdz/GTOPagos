import { Component } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RegisterService, RegisterRequest } from '../../../core/services/auth/register.service'
import { AlertsService } from '../../../core/services/alerts/Alerts.service'
import { LucideAngularModule, User } from 'lucide-angular';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    LucideAngularModule
],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  readonly User = User;

  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private alert: AlertsService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.alert.show('Por favor completa todos los campos correctamente.', 'error');
      return;
    }

    const formValue = this.registerForm.value;

    const registerData: RegisterRequest = {
      email: formValue.email,
      password: formValue.password,
      confirm_password: formValue.password,  // si pides confirmación, ajusta según tu UI
    };

    this.registerService.postRegister(registerData).subscribe({
      next: (res) => {
        this.alert.show('Registro exitoso', 'success');
        this.registerForm.reset()
      },
      error: (err) => {
        console.error('Error en registro', err);
        if (err?.error?.email?.[0] === 'user with this email already exists.') {
          this.alert.show('El correo electrónico ya está registrado.', 'error');
        } else {
          this.alert.show('Ocurrió un error al registrarse.', 'error');
        }
      }
    });
  }
}
