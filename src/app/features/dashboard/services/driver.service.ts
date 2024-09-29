import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from '../models/driver.model';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
  private apiUrl = 'https://yourapiurl.com/api/drivers'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getAllDrivers(trCompanyId: string): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.apiUrl}/trCompanyId/${trCompanyId}`);
  }
}
