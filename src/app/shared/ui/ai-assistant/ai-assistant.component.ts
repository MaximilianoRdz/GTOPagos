import { Component, signal, computed, ElementRef, ViewChild, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bot, Sparkles, Send, X, MessageSquare, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock, CreditCard, PieChart, ArrowRight, RefreshCw, Zap, Target, TrendingUp, Activity, Lightbulb, ShieldCheck, Check, Ban, FileText, Calendar, Tag, Folder } from 'lucide-angular';
import { AiService, ChatMessage, AgentActionResponse } from '../../../core/services/ai/ai.service';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './ai-assistant.component.html',
  styleUrls: ['./ai-assistant.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiAssistantComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef;

  // Iconos de Lucide
  readonly Bot = Bot;
  readonly Sparkles = Sparkles;
  readonly Send = Send;
  readonly X = X;
  readonly MessageSquare = MessageSquare;
  readonly ChevronDown = ChevronDown;
  readonly ChevronUp = ChevronUp;
  readonly AlertTriangle = AlertTriangle;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly CreditCard = CreditCard;
  readonly PieChart = PieChart;
  readonly ArrowRight = ArrowRight;
  readonly RefreshCw = RefreshCw;
  readonly Zap = Zap;
  readonly Target = Target;
  readonly TrendingUp = TrendingUp;
  readonly Activity = Activity;
  readonly Lightbulb = Lightbulb;
  readonly ShieldCheck = ShieldCheck;
  readonly Check = Check;
  readonly Ban = Ban;
  readonly FileText = FileText;
  readonly Calendar = Calendar;
  readonly Tag = Tag;
  readonly Folder = Folder;

  isOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  userInput = signal<string>('');
  expandedThoughts = signal<Record<string, boolean>>({});
  expandedSchedules = signal<Record<string, boolean>>({});
  actionLoading = signal<Record<string, boolean>>({});
  actionCompleted = signal<Record<string, { confirmed: boolean; message?: string; recordId?: number }>>({});

  messages = signal<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: '¡Hola! Soy tu **Asistente Financiero GTOPagos** con arquitectura de agentes, MCP y skills determinísticas. ¿En qué te puedo ayudar hoy?',
      timestamp: new Date(),
      data: {
        widget_type: 'assistant_capabilities',
        capabilities: [
          { title: 'Registrar Movimiento', example: 'Registra un gasto de $350 en Oxxo' },
          { title: 'Auditoría 360° del Sistema', example: 'Analiza todo el sistema con mis gastos e ingresos y metas' },
          { title: 'Cálculo de MSI', example: 'Compré una laptop de $12,000 a 12 meses sin intereses' },
          { title: 'Semáforo de Pagos', example: '¿Cuáles son mis pagos más urgentes?' }
        ]
      }
    }
  ]);

  private shouldScrollToBottom = false;

  constructor(
    private aiService: AiService,
    private alertsService: AlertsService
  ) {}

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  toggleOpen(): void {
    this.isOpen.update(open => !open);
    if (this.isOpen()) {
      this.shouldScrollToBottom = true;
    }
  }

  close(): void {
    this.isOpen.set(false);
  }

  toggleThought(msgId: string): void {
    this.expandedThoughts.update(map => ({
      ...map,
      [msgId]: !map[msgId]
    }));
  }

  toggleSchedule(msgId: string): void {
    this.expandedSchedules.update(map => ({
      ...map,
      [msgId]: !map[msgId]
    }));
  }

  sendPrompt(text: string): void {
    const query = text.trim();
    if (!query || this.isLoading()) return;

    // Agregar mensaje del usuario
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMsg]);
    this.userInput.set('');
    this.isLoading.set(true);
    this.shouldScrollToBottom = true;

    this.aiService.sendMessage(query).subscribe({
      next: (res: AgentActionResponse) => {
        const agentMsg: ChatMessage = {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          text: res.user_message,
          timestamp: new Date(),
          thought: res.thought,
          data: res.data,
          actionType: res.action_type
        };
        this.messages.update(msgs => [...msgs, agentMsg]);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: '⚠️ No pude conectarme con el servicio de IA en este momento. Por favor verifica que el backend esté en ejecución.',
          timestamp: new Date(),
          actionType: 'ALERT'
        };
        this.messages.update(msgs => [...msgs, errorMsg]);
        this.isLoading.set(false);
        this.shouldScrollToBottom = true;
      }
    });
  }

  confirmAction(msg: ChatMessage): void {
    if (!msg.data || this.actionLoading()[msg.id]) return;

    this.actionLoading.update(m => ({ ...m, [msg.id]: true }));

    const payload = {
      dashboard_id: msg.data.dashboard_id,
      record_type: msg.data.behavior,
      amount: msg.data.amount,
      description: msg.data.description,
      category_name: msg.data.category_name,
      record_date: msg.data.record_date
    };

    this.aiService.executeAction(msg.data.action || 'CREATE_RECORD', payload).subscribe({
      next: (res) => {
        this.actionLoading.update(m => ({ ...m, [msg.id]: false }));
        this.actionCompleted.update(m => ({
          ...m,
          [msg.id]: {
            confirmed: true,
            message: res.user_message || 'Movimiento registrado con éxito.',
            recordId: res.record_id
          }
        }));
        this.alertsService.success('Movimiento registrado en base de datos correctamente');
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        this.actionLoading.update(m => ({ ...m, [msg.id]: false }));
        const errorMsg = err?.error?.error || 'No se pudo registrar el movimiento.';
        this.alertsService.error(errorMsg);
      }
    });
  }

  cancelAction(msg: ChatMessage): void {
    this.actionCompleted.update(m => ({
      ...m,
      [msg.id]: {
        confirmed: false,
        message: 'Operación cancelada por el usuario.'
      }
    }));
    this.alertsService.info('Registro cancelado.');
    this.shouldScrollToBottom = true;
  }

  onHorizontalWheel(event: WheelEvent): void {
    if (event.deltaY !== 0) {
      event.preventDefault();
      const target = event.currentTarget as HTMLElement;
      target.scrollLeft += event.deltaY;
    }
  }

  formatMarkdown(text: string): string {
    if (!text) return '';
    // Formateo ligero y seguro de Markdown (negritas, cursivas, listas, código)
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-300 text-xs font-mono">$1</code>')
      .replace(/^### (.*$)/gim, '<h4 class="font-bold text-base text-gray-900 dark:text-white mt-2 mb-1">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 class="font-bold text-lg text-gray-900 dark:text-white mt-3 mb-1">$1</h3>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-sm text-gray-700 dark:text-gray-300">$1</li>')
      .replace(/\n\n/g, '<div class="h-2"></div>');
    return formatted;
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (_) {}
  }
}
