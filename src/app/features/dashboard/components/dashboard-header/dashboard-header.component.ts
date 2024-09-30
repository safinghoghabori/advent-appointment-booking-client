import { Component } from '@angular/core';
import {
  TerminalData,
  TrCompanyData,
  UserType,
} from '../../../../auth/login/models/login.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'dashboard-header',
  standalone: true,
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
  imports: [CommonModule],
})
export class DashboardHeaderComponent {
  userType: string | null = '';
  userData: TrCompanyData | TerminalData | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  getUserName(): string {
    return this.userType === UserType.Terminal
      ? (this.userData as TerminalData).portName
      : (this.userData as TrCompanyData).trCompanyName;
  }

  addNewAppointment() {
    this.router.navigate(['/new-appointment']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
