import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { AuthService } from '../../../core/services/auth.service';
import { Terminal } from '../models/terminal.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = 'https://localhost:7189/api/appointment';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/all`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/get/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/create`, appointment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${appointmentId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancel/${appointmentId}`, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  approveAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/approve/${appointmentId}`, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authService.getToken()}`,
      }),
    });
  }

  getAvailableTimeSlots(
    trCompanyId: number,
    date: string
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/available-timeslots/${date}?trCompanyId=${trCompanyId}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
      }
    );
  }

  updateAppointmentDateTime(
    appointmentId: number,
    updatedInfo: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/update-appointment/${appointmentId}`,
      updatedInfo,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.authService.getToken()}`,
        }),
      }
    );
  }
}
