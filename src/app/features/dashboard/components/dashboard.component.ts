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
  userData: TrCompanyData | TerminalData = {} as TrCompanyData;

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
    this.driverService.getAllDrivers(trCompanyId).subscribe(
      (data) => {
        this.drivers = data;
      },
      (error) => {
        console.error('Error fetching drivers', error);
      }
    );
  }

  onAddNewAppointment() {
    this.router.navigate(['/add-appointment']);
  }

  deleteAppointment(appointmentId: number) {
    this.appointmentService.deleteAppointment(appointmentId).subscribe(
      (response) => {
        this.loadAppointments();
      },
      (error) => {
        console.error('Error deleting appointment', error);
      }
    );
  }

  updateAppointment(appointmentId: number) {
    this.router.navigate(['/update-appointment', appointmentId]);
  }

  cancelAppointment(appointmentId: number) {
    this.appointmentService.cancelAppointment(appointmentId).subscribe(
      (response) => {
        this.loadAppointments();
      },
      (error) => {
        console.error('Error canceling appointment', error);
      }
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
