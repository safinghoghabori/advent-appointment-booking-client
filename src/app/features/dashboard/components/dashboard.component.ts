import { Component } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { AuthService } from '../../../core/services/auth.service';
import { DriverService } from '../services/driver.service';
import { Router } from '@angular/router';
import { Appointment } from '../models/appointment.model';
import { Driver } from '../models/driver.model';
import { CommonModule } from '@angular/common';
import {
  TerminalData,
  TrCompanyData,
  UserType,
} from '../../../auth/login/models/login.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  appointments: Appointment[] = [];
  drivers: Driver[] = [];
  userType: string | null = '';
  userData: TrCompanyData | TerminalData | undefined;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
    this.userData = this.authService.getUserData();

    this.loadAppointments();

    if (this.userType === 'TruckingCompany') {
      this.loadDrivers();
    }
  }

  getUserName(): string {
    return this.userType === UserType.Terminal
      ? (this.userData as TerminalData).portName
      : (this.userData as TrCompanyData).trCompanyName;
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.appointments = data;
      },
      (error) => {
        console.error('Error fetching appointments', error);
      }
    );
  }

  loadDrivers() {
    const trCompanyId = localStorage.getItem('trCompanyId') || '123';
    this.driverService.getAllDrivers(trCompanyId).subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error fetching drivers', error);
      },
    });
  }

  addNewAppointment() {
    this.router.navigate(['/add-appointment']);
  }

  deleteAppointment(appointmentId: number) {
    this.appointmentService.deleteAppointment(appointmentId).subscribe({
      next: (response) => {
        this.loadAppointments();
      },
      error: (error) => {
        console.error('Error deleting appointment', error);
      },
    });
  }

  updateAppointment(appointmentId: number) {
    this.router.navigate(['/update-appointment', appointmentId]);
  }

  cancelAppointment(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe({
      next: (response) => {
        this.loadAppointments();
      },
      error: (error) => {
        console.error('Error canceling appointment', error);
      },
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
