import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import {
  LoginReq,
  LoginResp,
  UserType,
} from '../../auth/login/models/login.model';
import {
  TerminalFormData,
  TrCompanyFormData,
} from '../../auth/register/models/register.model';
import { ErrorHandlerService } from './error-handler.service';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private errorHandlerService: ErrorHandlerService,
    private localStorageService: LocalStorageService
  ) {}

  login(credentials: LoginReq, userType: UserType): Observable<LoginResp> {
    return this.http
      .post<LoginResp>(
        `${this.apiUrl}/auth/login?userType=${userType}`,
        credentials
      )
      .pipe(
        tap((response: LoginResp) => {
          this.localStorageService.setUserType(userType);
          this.localStorageService.setToken(response.token);
          this.localStorageService.setUserData(response.data);
          this.router.navigate(['/dashboard']);
        }),
        catchError(this.errorHandlerService.handleError)
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
        catchError(this.errorHandlerService.handleError)
      );
  }

  isAuthenticated(): boolean {
    const token = this.localStorageService.getToken();
    return !!token;
  }

  logout() {
    this.localStorageService.removeLocalStorageData();
    this.router.navigate(['/login']);
  }
}
