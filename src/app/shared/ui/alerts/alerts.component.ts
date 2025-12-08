import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../../core/services/alerts/Alerts.service';

@Component({
  selector: 'app-alerts',
  imports: [CommonModule],
  template: `
    @if (alert.visible()) {
      <div
        class="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm text-white animate-fade-in-out"
      [ngClass]="{
        'bg-green-600': alert.type() === 'success',
        'bg-red-600': alert.type() === 'error',
        'bg-blue-600': alert.type() === 'info'
      }"
        >
        {{ alert.message() }}
      </div>
    }
    `,
  styles: [`
    @keyframes fade-in-out {
      0% { opacity: 0; transform: translateY(-10px); }
      10% { opacity: 1; transform: translateY(0); }
      90% { opacity: 1; }
      100% { opacity: 0; transform: translateY(-10px); }
    }

    .animate-fade-in-out {
      animation: fade-in-out 3.5s ease-in-out forwards;
    }
  `]
})
export class AlertsComponent {
  constructor(public alert: AlertsService) {}
}
