import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { RegisterService, Currency, RegisterRequest } from '../../../core/services/auth/register.service'
import { AlertsService } from '../../../core/services/alerts/Alerts.service'


@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  currencies: Currency[] = [];

  incomeFrequencies = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private alert: AlertsService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]],
      salary: ['', Validators.required],
      currency_id: ['', Validators.required],
      income_frequency: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadCurrencies();
  }

  get f() {
    return this.registerForm.controls;
  }

  loadCurrencies() {
    this.registerService.getCurrencies().subscribe({
      next: (data) => this.currencies = data,
      error: (err) => console.error('Error loading currencies', err),
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.alert.show('Por favor completa todos los campos correctamente.', 'error');
      return;
    }

    const formValue = this.registerForm.value;

    const registerData: RegisterRequest = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      confirm_password: formValue.password,  // si pides confirmación, ajusta según tu UI
      salary: Number(formValue.salary),
      currency_id: Number(formValue.currency),
      income_frequency: formValue.income_frequency,
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
