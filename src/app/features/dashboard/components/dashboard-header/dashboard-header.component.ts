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
import { LocalStorageService } from '../../../../core/services/local-storage.service';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    this.userData = this.localStorageService.getUserData();
    this.userType = this.localStorageService.getUserType();
  }

  getUserName(): string {
    return this.userType === UserType.Terminal
      ? (this.userData as TerminalResp).portName
      : (this.userData as TrCompanyResp).trCompanyName;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
