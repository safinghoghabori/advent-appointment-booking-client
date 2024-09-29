import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  LoginReq,
  LoginResp,
  TerminalData,
  TrCompanyData,
  UserType,
} from '../../auth/login/models/login.model';
import {
  TerminalFormData,
  TrCompanyFormData,
} from '../../auth/register/models/register.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7189/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(credentials: LoginReq, userType: UserType): Observable<LoginResp> {
    return this.http
      .post<LoginResp>(
        `${this.apiUrl}/auth/login?userType=${userType}`,
        credentials
      )
      .pipe(
        tap((response: LoginResp) => {
          this.setUserType(userType);
          this.setToken(response.token);
          this.setUserData(response.data);
          this.router.navigate(['/dashboard']);
        }),
        catchError(this.handleError)
      );
  }

  register(
    userData: TrCompanyFormData | TerminalFormData,
    userType: UserType
  ): Observable<{ message: string }> {
    return this.http
      .post<{ message: string }>(
        `${this.apiUrl}/registration/${userType}`,
        userData
      )
      .pipe(
        tap((response: { message: string }) => {
          this.router.navigate(['/login']);
          return response.message;
        }),
        catchError(this.handleError)
      );
  }

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

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = error.error.message;
    }
    return throwError(errorMessage);
  }
}
