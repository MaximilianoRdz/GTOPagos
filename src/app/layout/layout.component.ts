import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../shared/ui/sidebar/sidebar.component";
import { NavbarComponent } from "../shared/ui/navbar/navbar.component";

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent { }
