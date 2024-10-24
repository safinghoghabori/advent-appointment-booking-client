import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Appointment } from '../dashboard/models/appointment.model';
import { Driver } from '../dashboard/models/driver.model';
import { AppointmentService } from '../dashboard/services/appointment.service';
import { Router } from '@angular/router';
import { UserType } from '../../auth/login/models/login.model';
import { AppointmentStatus } from '../../core/constants/constants';
import { FormsModule } from '@angular/forms'; 
import { LocalStorageService } from '../../core/services/local-storage.service';
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
        this.filteredAppointments = data; 
        this.extractUniqueDrivers(); 
        this.extractUniqueTerminal();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
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

downloadExcel(){
  this.appointmentService.downloadAppointmentsExcel().subscribe({
    next: (response) => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link element and trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Appointments.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Cleanup
      window.URL.revokeObjectURL(url);
    },
    error: (error) => {
      console.error('Error downloading the file:', error);
      alert('Failed to download the file. Please try again.');
    }
  });
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
