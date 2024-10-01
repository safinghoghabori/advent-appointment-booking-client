import { Component } from '@angular/core';
import {
  TerminalData,
  TerminalResp,
  TrCompanyData,
  TrCompanyResp,
  UserType,
} from '../../../../auth/login/models/login.model';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'dashboard-header',
  standalone: true,
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css',
  imports: [CommonModule, RouterLink],
})
export class DashboardHeaderComponent {
  userType: string | null = '';
  userData: TrCompanyData | TerminalData | undefined;

  constructor(private router: Router, private authService: AuthService) {
    this.userData = this.authService.getUserData();
    this.userType = this.authService.getUserType();
  }

  getUserName(): string {
    return this.userType === UserType.Terminal
      ? (this.userData as TerminalResp).portName
      : (this.userData as TrCompanyResp).trCompanyName;
  }

  addNewAppointment() {
    this.router.navigate(['dashboard/new-appointment']);
  }

  onDriversClick() {
    this.router.navigate(['dashboard/drivers']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
