import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private apiUrl = `${environment.baseUrl}/appointment`;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private errorHandlerService: ErrorHandlerService
  ) {}

  getAppointments(): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(`${this.apiUrl}/all`, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.localStorageService.getToken()}`,
        }),
      })
      .pipe(catchError(this.errorHandlerService.handleError));
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/get/${id}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`,
      }),
    });
  }

  createAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(`${this.apiUrl}/create`, appointment, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`,
      }),
    });
  }

  deleteAppointment(appointmentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${appointmentId}`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`,
      }),
    });
  }

  cancelAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cancel/${appointmentId}`, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`,
      }),
    });
  }

  approveAppointment(appointmentId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/approve/${appointmentId}`, null, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.localStorageService.getToken()}`,
      }),
    });
  }

  downloadAppointmentsExcel(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.localStorageService.getToken()}`,
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    return this.http.get(`${this.apiUrl}/all/?format=excel`, { headers, responseType: 'blob' });
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
          Authorization: `Bearer ${this.localStorageService.getToken()}`,
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
          Authorization: `Bearer ${this.localStorageService.getToken()}`,
        }),
      }
    );
  }
}
