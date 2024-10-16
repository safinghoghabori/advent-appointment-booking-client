import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  TerminalData,
  TrCompanyData,
  UserType,
} from '../../auth/login/models/login.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  setUserData(userData: TerminalData | TrCompanyData): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }

  getUserData(): TerminalData | TrCompanyData {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : [];
    }
    return {} as TerminalData | TrCompanyData;
  }

  setUserType(userType: UserType) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userType', userType);
    }
  }

  getUserType(): UserType | null {
    if (isPlatformBrowser(this.platformId)) {
      const userType = localStorage.getItem('userType');
      return userType as UserType;
    }
    return null;
  }

  removeLocalStorageData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('userType');
    }
  }
}
