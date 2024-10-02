import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Appointment } from '../dashboard/models/appointment.model';
import { Driver } from '../dashboard/models/driver.model';
import { AppointmentService } from '../dashboard/services/appointment.service';
import { AuthService } from '../../core/services/auth.service';
import { DriverService } from '../dashboard/services/driver.service';
import { Router } from '@angular/router';
import { UserType } from '../../auth/login/models/login.model';
import { AppointmentStatus } from '../../core/constants/constants';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent {
  appointments: Appointment[] = [];
  drivers: Driver[] = [];
  userType: UserType | null = null;
  appointmentStatus = AppointmentStatus;

  constructor(
    private appointmentService: AppointmentService,
    private authService: AuthService,
    private driverService: DriverService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userType = this.authService.getUserType();
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.appointments = data;
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      },
    });
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
    this.router.navigate(['dashboard/update-appointment', appointmentId]);
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

  approveAppointment(appointmentId: number) {
    this.appointmentService.approveAppointment(appointmentId).subscribe({
      next: (response) => {
        this.loadAppointments();
      },
      error: (error) => {
        console.error('Error canceling appointment', error);
      },
    });
  }
}
