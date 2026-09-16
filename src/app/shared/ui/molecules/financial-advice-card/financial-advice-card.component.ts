import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Wallet, Target, CreditCard } from 'lucide-angular';

@Component({
  selector: 'app-financial-advice-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  changeDetection: ChangeDetectionStrategy.Default,
  host: {
    class: 'block w-full',
  },
  template: `
    <div class="w-full">
      @if (showHeader) {
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div class="flex items-center gap-2">
            <div
              class="p-1.5 rounded-lg flex items-center justify-center shadow-xs transition-colors duration-300"
              [ngClass]="{
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300': activeContext === 'goals',
                'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300': activeContext === 'credit',
                'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300': activeContext === 'budget'
              }"
            >
              <lucide-angular
                [img]="activeContext === 'goals' ? Target : activeContext === 'credit' ? CreditCard : Wallet"
                class="w-4 h-4"
              ></lucide-angular>
            </div>
            <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200">{{ displayedTitle }}</h4>
          </div>

          <div class="flex items-center gap-2.5">
            @if (allowToggle && context !== 'goals') {
              <div class="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  (click)="switchContext('budget'); $event.stopPropagation()"
                  class="px-2 py-0.5 text-xs font-semibold rounded-md transition cursor-pointer"
                  [ngClass]="activeContext === 'budget'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                >
                  Gastos
                </button>
                <button
                  type="button"
                  (click)="switchContext('credit'); $event.stopPropagation()"
                  class="px-2 py-0.5 text-xs font-semibold rounded-md transition cursor-pointer"
                  [ngClass]="activeContext === 'credit'
                    ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'"
                >
                  Tarjetas
                </button>
              </div>
            }

            <span class="text-xs text-slate-400 dark:text-slate-500 font-medium hover:text-slate-600 dark:hover:text-slate-300 transition">
              Toca para ver otro
            </span>
          </div>
        </div>
      }

      <div class="relative w-full h-[155px] cursor-pointer select-none" (click)="nextAdvice()">
        @for (advice of currentAdvices; track advice; let i = $index) {
          <div
            class="absolute inset-0 p-5 rounded-2xl text-sm leading-relaxed shadow-sm transition-all duration-300 overflow-hidden flex items-center"
            [ngClass]="{
              'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 border border-emerald-200/70 dark:border-emerald-800/50': activeContext === 'goals',
              'bg-purple-50/70 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 border border-purple-200/70 dark:border-purple-800/50': activeContext === 'credit',
              'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 border border-indigo-200/70 dark:border-indigo-800/50': activeContext === 'budget'
            }"
            [ngStyle]="getAdviceStyle(i)"
          >
            <p
              [innerHTML]="advice"
              [class.invisible]="i !== currentAdviceIndex"
              class="transition-opacity duration-200"
            ></p>
          </div>
        }
      </div>
    </div>
  `,
})
export class FinancialAdviceCardComponent implements OnInit, OnChanges {
  readonly Wallet = Wallet;
  readonly Target = Target;
  readonly CreditCard = CreditCard;

  @Input() context: 'budget' | 'goals' | 'credit' = 'budget';
  @Input() title?: string;
  @Input() showHeader = true;
  @Input() allowToggle = false;

  activeContext: 'budget' | 'goals' | 'credit' = 'budget';

  readonly budgetAdvices: string[] = [
    '<strong>Gastos hormiga:</strong> Ese café o snack diario de $50 representa más de <strong>$18,000 al año</strong> que podrías retener en tu presupuesto.',
    '<strong>Regla de 48 horas:</strong> Antes de hacer una compra no esencial o imprevista, espera 48 horas. La gran mayoría de los impulsos se desvanecen.',
    '<strong>Tarjeta de crédito:</strong> Úsala como medio de pago y no como extensión de tu sueldo. Paga siempre el saldo para <strong>no generar intereses</strong>.',
    '<strong>Auditoría de suscripciones:</strong> Revisa membresías y plataformas cada mes. Cancelar servicios en desuso libera flujo de caja inmediato.',
    '<strong>Regla 50/30/20:</strong> Procura destinar máximo el <strong>50%</strong> a necesidades básicas, el <strong>30%</strong> a gustos personales y el <strong>20%</strong> a respaldo.',
    '<strong>Estrategia de deudas:</strong> Si tienes varias deudas con intereses, el <strong>método avalancha</strong> (pagar la de mayor tasa primero) te ahorrará más dinero.',
    '<strong>Compras inteligentes:</strong> Nunca hagas el súper con hambre ni sin una lista escrita. Hacerlo reduce hasta un <strong>20%</strong> los gastos imprevistos.',
    '<strong>Registro al instante:</strong> Anota tus compras en el momento exacto en que ocurren para evitar olvidos o desajustes a fin de mes.'
  ];

  readonly goalsAdvices: string[] = [
    '<strong>Págate a ti primero:</strong> Separa el aporte a tu meta el mismo día que recibes tu sueldo, antes de comenzar con los gastos del mes.',
    '<strong>Fondo de emergencias:</strong> Tu meta inicial prioritaria debe cubrir de <strong>3 a 6 meses</strong> de gastos básicos para blindarte ante cualquier imprevisto.',
    '<strong>Metas con fecha límite:</strong> Un objetivo sin fecha ni monto exacto suele quedarse solo en un deseo. Define plazos concretos para mantenerte enfocado.',
    '<strong>Automatiza tus aportes:</strong> Configura transferencias periódicas hacia tus metas; ahorrar de manera automática elimina la tentación de gastarlo.',
    '<strong>Cuentas separadas:</strong> Guarda el dinero de tus metas en apartados o cuentas de inversión distintas a tu cuenta de gastos diarios para no tocarlo.',
    '<strong>Celebra los hitos:</strong> Reconoce tu disciplina al alcanzar el <strong>25%, 50% y 75%</strong> de tu meta. Celebrar tus avances refuerza el hábito del ahorro.',
    '<strong>Interés compuesto:</strong> La constancia vence a la cantidad. Empezar hoy con poco dinero rinde mucho más que esperar a juntar grandes sumas.',
    '<strong>Divide y vencerás:</strong> Divide metas grandes en pequeños aportes semanales o quincenales para que el objetivo sea alcanzable y continuo.'
  ];

  readonly creditAdvices: string[] = [
    '<strong>Sé totalero:</strong> Paga siempre el <strong>monto para no generar intereses</strong> antes de tu fecha límite. Pagar el mínimo solo alarga la deuda y genera intereses muy caros.',
    '<strong>El truco de los 50 días:</strong> Compra 1 o 2 días <strong>después de tu fecha de corte</strong>. Esto te da hasta 50 días de financiamiento gratuito sin pagar un solo peso de interés.',
    '<strong>Regla del 30%:</strong> Procura no usar más del <strong>30% del límite</strong> de tu tarjeta. Superar este porcentaje impacta negativamente tu calificación en Buró de Crédito.',
    '<strong>Cuidado con los MSI:</strong> Los meses sin intereses no son dinero regalado. Acumular muchas compras a cuotas satura tu línea y ahoga tu liquidez mensual.',
    '<strong>Nunca retires efectivo:</strong> Disponer de efectivo en cajeros con tu tarjeta de crédito cobra comisiones inmediatas (5-10%) y las tasas de interés más altas del mercado.',
    '<strong>Aprovecha recompensas:</strong> Revisa los beneficios de tu tarjeta (<strong>cashback, puntos o seguros</strong>). Si pagas anualidad, asegúrate de que los beneficios superen su costo.',
    '<strong>Medio de pago, no sueldo:</strong> Usa tu tarjeta como una <strong>herramienta de pago</strong>, no como dinero extra. No gastes lo que no tengas actualmente disponible en tu cuenta.',
    '<strong>Domiciliación inteligente:</strong> Domiciliar el pago total de servicios básicos en tu tarjeta crea un historial crediticio intachable de forma automática.'
  ];

  currentAdviceIndex = 0;

  get displayedTitle(): string {
    if (this.title) return this.title;
    switch (this.activeContext) {
      case 'credit': return 'Consejos de Tarjeta de Crédito';
      case 'goals': return 'Consejos de Ahorro y Metas';
      case 'budget':
      default: return 'Consejos de Gastos y Presupuesto';
    }
  }

  get currentAdvices(): string[] {
    switch (this.activeContext) {
      case 'credit': return this.creditAdvices;
      case 'goals': return this.goalsAdvices;
      case 'budget':
      default: return this.budgetAdvices;
    }
  }

  ngOnInit(): void {
    this.activeContext = this.context;
    this.resetAdviceIndex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['context'] && changes['context'].currentValue) {
      this.activeContext = changes['context'].currentValue;
    }
    if (this.currentAdviceIndex >= this.currentAdvices.length) {
      this.currentAdviceIndex = 0;
    }
  }

  switchContext(newContext: 'budget' | 'credit'): void {
    this.activeContext = newContext;
    this.resetAdviceIndex();
  }

  private resetAdviceIndex(): void {
    this.currentAdviceIndex = Math.floor(Math.random() * this.currentAdvices.length);
  }

  nextAdvice(): void {
    this.currentAdviceIndex = (this.currentAdviceIndex + 1) % this.currentAdvices.length;
  }

  getAdviceStyle(index: number): Record<string, string | number> {
    const total = this.currentAdvices.length;
    let diff = (index - this.currentAdviceIndex + total) % total;
    if (diff > total / 2) diff -= total;

    if (diff === 0) {
      return {
        transform: 'translateY(0) scale(1)',
        opacity: 1,
        'z-index': 10,
        pointerEvents: 'auto'
      };
    } else if (diff === 1 || (diff < 0 && diff === 1 - total)) {
      return {
        transform: 'translateY(8px) scale(0.96)',
        opacity: 0.6,
        'z-index': 5,
        pointerEvents: 'none'
      };
    } else if (diff === 2 || (diff < 0 && diff === 2 - total)) {
      return {
        transform: 'translateY(16px) scale(0.92)',
        opacity: 0.25,
        'z-index': 1,
        pointerEvents: 'none'
      };
    } else {
      return {
        transform: 'translateY(24px) scale(0.88)',
        opacity: 0,
        'z-index': 0,
        pointerEvents: 'none'
      };
    }
  }
}

