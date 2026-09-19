import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../shared/ui/sidebar/sidebar.component";
import { AiAssistantComponent } from "../shared/ui/ai-assistant/ai-assistant.component";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, AiAssistantComponent],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './layout.component.html',
})
export class LayoutComponent { 
  
}
