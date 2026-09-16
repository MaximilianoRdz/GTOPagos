import { Component, OnInit, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Sparkles, Loader2, DollarSign, ArrowRight, AlertCircle } from 'lucide-angular';
import { LoginService } from '../../../core/services/auth/login.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-transparent relative overflow-hidden select-none">
      <!-- Background Glow Effects -->
      <div class="absolute w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-3xl -top-20 -left-20 pointer-events-none"></div>
      <div class="absolute w-96 h-96 bg-teal-500/10 dark:bg-teal-500/20 rounded-full blur-3xl -bottom-20 -right-20 pointer-events-none"></div>

      <div class="w-full max-w-md relative z-10">
        <div class="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
          
          <!-- Logo / Icon Ring -->
          <div class="relative mb-6">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 transform -rotate-3 transition-transform duration-300">
              <lucide-angular [img]="DollarSign" class="w-10 h-10 text-white"></lucide-angular>
            </div>
            <div class="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-sm animate-bounce">
              <lucide-angular [img]="Sparkles" class="w-4 h-4 text-emerald-950"></lucide-angular>
            </div>
          </div>

          <!-- Title -->
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Modo Demo GTOPagos
          </h1>

          @if (!errorMessage()) {
            <p class="text-sm text-slate-600 dark:text-slate-300 mb-8 max-w-xs leading-relaxed">
              Iniciando sesión de invitado y preparando tus datos financieros de prueba...
            </p>

            <!-- Loading Spinner & Step Indicator -->
            <div class="w-full flex flex-col items-center gap-4">
              <div class="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xs">
                <lucide-angular [img]="Loader2" class="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400"></lucide-angular>
                <span>Cargando Dashboard interactivo...</span>
              </div>

              <!-- Animated Progress Line -->
              <div class="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden relative mt-2">
                <div class="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
              </div>
            </div>
          } @else {
            <!-- Error State -->
            <div class="w-full flex flex-col items-center gap-4 my-4">
              <div class="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                <lucide-angular [img]="AlertCircle" class="w-6 h-6"></lucide-angular>
              </div>
              <p class="text-xs text-red-600 dark:text-red-400 font-medium max-w-xs">
                {{ errorMessage() }}
              </p>

              <div class="flex flex-col w-full gap-2 mt-2">
                <button
                  type="button"
                  (click)="startDemoLogin()"
                  class="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-all cursor-pointer shadow-md"
                >
                  Reintentar acceso
                </button>
                <button
                  type="button"
                  (click)="goToLogin()"
                  class="w-full py-2.5 px-4 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Ir al inicio de sesión
                </button>
              </div>
            </div>
          }

          <div class="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/80 w-full text-center">
            <span class="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Acceso sin registro para reclutadores y visitantes
            </span>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes loading {
      0% { transform: translateX(-100%); }
      50% { transform: translateX(50%); }
      100% { transform: translateX(200%); }
    }
  `]
})
export class DemoComponent implements OnInit {
  private loginService = inject(LoginService);
  private auth = inject(AuthService);
  private alert = inject(AlertsService);
  private router = inject(Router);

  readonly DollarSign = DollarSign;
  readonly Sparkles = Sparkles;
  readonly Loader2 = Loader2;
  readonly ArrowRight = ArrowRight;
  readonly AlertCircle = AlertCircle;

  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.startDemoLogin();
  }

  startDemoLogin(): void {
    this.errorMessage.set(null);

    // Si ya tiene sesión activa como demo, entra de inmediato
    if (this.auth.user()?.email === 'demo@gtopagos.com') {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loginService.loginAsDemo().subscribe({
      next: (res) => {
        this.auth.setSession(res.access_token, res.user, res.refresh_token);
        this.alert.show('¡Bienvenido al Modo Demo de GTOPagos!', 'success');
        
        // Breve retardo para permitir una transición visual suave
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (err) => {
        const msg = err.error?.detail ?? 'No se pudo inicializar el modo demo. Por favor intenta de nuevo.';
        this.errorMessage.set(msg);
        this.alert.show(msg, 'error');
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
