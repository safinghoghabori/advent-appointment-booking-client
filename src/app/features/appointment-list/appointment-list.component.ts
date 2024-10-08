import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Appointment } from '../dashboard/models/appointment.model';
import { Driver } from '../dashboard/models/driver.model';
import { AppointmentService } from '../dashboard/services/appointment.service';
import { Router } from '@angular/router';
import { UserType } from '../../auth/login/models/login.model';
import { AppointmentStatus } from '../../core/constants/constants';
import { LocalStorageService } from '../../core/services/local-storage.service';

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
  isLoading: boolean = false;
  errorMessage: string | null = '';

  constructor(
    private appointmentService: AppointmentService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userType = this.localStorageService.getUserType();
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;
    this.errorMessage = null;

    this.appointmentService.getAppointments().subscribe({
      next: (data) => {
        this.isLoading = false;
        this.appointments = data;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
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
