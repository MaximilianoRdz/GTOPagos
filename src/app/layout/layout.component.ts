import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../shared/ui/sidebar/sidebar.component";
import { NavbarComponent } from "../shared/ui/navbar/navbar.component";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent { 
  
}
