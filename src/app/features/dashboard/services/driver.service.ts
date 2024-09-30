import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'https://localhost:7189/api/driver';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getDrivers(trCompanyId: number): Observable<Driver[]> {
    return this.http.get<Driver[]>(
      `${this.apiUrl}/trCompanyId/${trCompanyId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
      }
    );
  }
}
