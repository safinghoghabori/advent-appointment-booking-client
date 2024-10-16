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
import { FormsModule } from '@angular/forms'; 
@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.css',
})
export class AppointmentListComponent {
  appointments: Appointment[] = [];
  drivers: Driver[] = [];
  userType: UserType | null = null;
  appointmentStatus = AppointmentStatus;
  filteredAppointments: Appointment[] = []; 
  selectedDriver: string = ''; 
  uniqueDrivers: string[] = []; 
  selectedTerminal: string = ''; 
  uniqueTerminals: string[] = []; 
  selectedDate :Date | null = null;
  showFilterOptions: boolean = false; 
  selectedStatus="";
  appointmentsPerPage = 5; 
  currentPage = 1; 
  totalPages = 1;

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
        this.filteredAppointments = data; 
        this.extractUniqueDrivers(); 
        this.extractUniqueTerminal();
      },
      error: (error) => {
        console.error('Error fetching appointments', error);
      },
    });
  }

  get displayedAppointments() {
    const startIndex = (this.currentPage - 1) * this.appointmentsPerPage;
    this.totalPages = Math.ceil(this.filteredAppointments.length / this.appointmentsPerPage);

    return this.filteredAppointments.slice(startIndex, startIndex + this.appointmentsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  toggleFilterOptions() {
    this.showFilterOptions = !this.showFilterOptions;
  }

  extractUniqueDrivers() {
    const driversSet = new Set(this.appointments.map(a => a.driverName));
    this.uniqueDrivers = Array.from(driversSet);
  }

  extractUniqueTerminal(){
    const termianlSet= new Set(this.appointments.map(a => a.terminalName));
    this.uniqueTerminals = Array.from(termianlSet);
  }

  filterAppointments() {
      this.filteredAppointments = this.appointments.filter(appointment => {
      const matchesDriver = this.selectedDriver ? appointment.driverName === this.selectedDriver : true;
      const matchesTerminal = this.selectedTerminal ? appointment.terminalName === this.selectedTerminal : true;
      const matchesDate = this.selectedDate ? appointment.appointmentDate === this.selectedDate : true; 
      const matchesStatus=this.selectedStatus ? appointment.appointmentStatus===this.selectedStatus : true;
        
      return matchesDriver && matchesTerminal && matchesStatus && matchesDate;
    });

    this.currentPage = 1;
}

resetFilters() {
  this.selectedDriver = '';
  this.selectedTerminal = '';
  this.selectedDate = null; 
  this.selectedStatus='';
  
  this.filterAppointments(); 
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
