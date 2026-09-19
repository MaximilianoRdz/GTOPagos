import { Component, signal, computed, ElementRef, ViewChild, AfterViewChecked, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bot, Sparkles, Send, X, MessageSquare, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Clock, CreditCard, PieChart, ArrowRight, RefreshCw, Zap } from 'lucide-angular';
import { AiService, ChatMessage, AgentActionResponse } from '../../../core/services/ai/ai.service';
import { I18nService } from '../../../core/i18n/i18n.service';

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

  isOpen = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  userInput = signal<string>('');
  expandedThoughts = signal<Record<string, boolean>>({});
  expandedSchedules = signal<Record<string, boolean>>({});

  messages = signal<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: '¡Hola! Soy tu **Asistente Financiero GTOPagos** con arquitectura de agentes, MCP y skills determinísticas. ¿En qué te puedo ayudar hoy?',
      timestamp: new Date(),
      data: {
        widget_type: 'assistant_capabilities',
        capabilities: [
          { title: 'Cálculo de MSI', example: 'Compré una laptop de $12,000 a 12 meses sin intereses' },
          { title: 'Semáforo de Pagos', example: '¿Cuáles son mis pagos más urgentes?' },
          { title: 'Flujo Quincenal', example: 'Gano 20,000, ¿cómo está mi corte del 15?' },
          { title: 'Regla 50/30/20', example: 'Explícame la regla de ahorro 50/30/20' }
        ]
      }
    }
  ]);

  private shouldScrollToBottom = false;

  constructor(
    private aiService: AiService,
    public i18n: I18nService
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
