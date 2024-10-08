import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terminal } from '../models/terminal.model';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private apiUrl = `${environment.baseUrl}/terminals`;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  getTerminals(): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(`${this.apiUrl}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`,
      }),
    });
  }
}
