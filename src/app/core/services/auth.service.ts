import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7189/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: LoginReq, userType: UserType): Observable<LoginResp> {
    return this.http
      .post<LoginResp>(`${this.apiUrl}/auth?userType=${userType}`, credentials)
      .pipe(
        tap((response: LoginResp) => {
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
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setUserData(userData: TerminalData | TrCompanyData): void {
    localStorage.setItem('userData', JSON.stringify(userData));
  }

  getUserData(): TerminalData | TrCompanyData {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : [];
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
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
