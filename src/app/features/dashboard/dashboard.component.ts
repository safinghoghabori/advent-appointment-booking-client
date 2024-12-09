import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardHeaderComponent } from './components/dashboard-header/dashboard-header.component';
import { RouterOutlet } from '@angular/router';
import { DashboardFooterComponent } from './components/dashboard-footer/dashboard-footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DashboardHeaderComponent,
    DashboardFooterComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
