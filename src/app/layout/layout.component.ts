import { Component, ChangeDetectionStrategy } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../shared/ui/sidebar/sidebar.component";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './layout.component.html',
})
export class LayoutComponent { 
  
}
