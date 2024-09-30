import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terminal } from '../models/terminal.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private apiUrl = 'https://localhost:7189/api/terminals';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getTerminals(): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(`${this.apiUrl}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }
}
