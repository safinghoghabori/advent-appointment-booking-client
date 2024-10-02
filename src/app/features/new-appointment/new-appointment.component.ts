import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Terminal } from '../dashboard/models/terminal.model';
import { Driver } from '../dashboard/models/driver.model';
import { AppointmentService } from '../dashboard/services/appointment.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DriverService } from '../dashboard/services/driver.service';
import { AuthService } from '../../core/services/auth.service';
import { TrCompanyResp } from '../../auth/login/models/login.model';
import { CommonModule } from '@angular/common';
import { TerminalService } from '../dashboard/services/terminal.service';
import { Appointment } from '../dashboard/models/appointment.model';
import { MOVE_TYPES, SIZE_TYPES } from '../../core/constants/constants';

@Component({
  selector: 'app-new-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './new-appointment.component.html',
  styleUrl: './new-appointment.component.css',
})
export class NewAppointmentComponent {
  appointmentForm: FormGroup;
  step: number = 1;
  terminals: Terminal[] = [];
  drivers: Driver[] = [];
  appointmentId: string | null = null;
  isEditMode: boolean = false;
  showChassisNumberField: boolean = false;
  trCompanyData: TrCompanyResp | null = null;
  errorMessage: string | null = null;
  moveTypes = MOVE_TYPES;
  sizeTypes = SIZE_TYPES;
  availableTimeSlots: string[] = [];

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private driverService: DriverService,
    private authService: AuthService,
    private terminalService: TerminalService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.appointmentForm = this.fb.group({
      terminalId: ['', Validators.required],
      driverId: ['', Validators.required],
      containerNumber: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-z]{3}[0-9]{8}$/)],
      ],
      moveType: ['', Validators.required],
      sizeType: ['', Validators.required],
      line: ['', Validators.required],
      needChassis: [false],
      chassisNo: [''],
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.trCompanyData = this.authService.getUserData() as TrCompanyResp;
    this.loadTerminals();
    this.loadDrivers();

    this.appointmentId = this.route.snapshot.paramMap.get('id');
    if (this.appointmentId) {
      this.isEditMode = true;
      this.loadAppointmentData(this.appointmentId);
    }
  }

  loadAppointmentData(id: string) {
    this.appointmentService.getAppointmentById(id).subscribe({
      next: (appointment: Appointment) => {
        this.appointmentForm.patchValue(appointment);
      },
      error: (error) => console.error('Failed to load appointment data', error),
    });
  }

  // Toggle the chassis number field validation and visibility
  toggleChassisField(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    console.log('isChecked...', isChecked);

    const chassisControl = this.appointmentForm.get('chassisNo');

    if (isChecked) {
      chassisControl?.setValidators([Validators.required]); // Add validation if chassis is needed
      this.showChassisNumberField = true;
    } else {
      chassisControl?.clearValidators(); // Remove validation if chassis is not needed
      this.showChassisNumberField = false;
    }
    chassisControl?.updateValueAndValidity(); // Re-evaluate the control
  }

  loadTerminals() {
    this.terminalService.getTerminals().subscribe({
      next: (terminals) => {
        this.terminals = terminals;
      },
      error: (error) => console.error('Failed to load terminals', error),
    });
  }

  loadDrivers() {
    this.driverService.getDrivers(this.trCompanyData!.trCompanyId).subscribe({
      next: (drivers) => {
        this.drivers = drivers;
      },
      error: (error) => {
        console.error('Failed to load drivers', error);
      },
    });
  }

  goToStep(stepNumber: number) {
    if (
      this.step === 1 &&
      this.appointmentForm.get('terminalId')?.valid &&
      this.appointmentForm.get('driverId')?.valid
    ) {
      this.step = stepNumber;
    } else if (this.step === 2) {
      this.step = stepNumber;
    } else if (this.step === 3) {
      this.step = stepNumber;
    }
  }

  submitForm() {
    if (this.isEditMode) {
      // this.updateAppointment();
    } else {
      this.createAppointment();
    }
  }

  createAppointment() {
    if (this.appointmentForm.valid) {
      const formData = {
        ...this.appointmentForm.value,
        trCompanyId: this.trCompanyData?.trCompanyId,
      };

      this.appointmentService.createAppointment(formData).subscribe({
        next: (response) => {
          console.log('Appointment created successfully', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error.message;
        },
      });
    }

    this.errorMessage = 'Please fill all required fields.';
  }

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    const trCompanyId = this.trCompanyData?.trCompanyId;

    this.appointmentService
      .getAvailableTimeSlots(trCompanyId!, selectedDate)
      .subscribe({
        next: (slots) => {
          this.availableTimeSlots = slots;
        },
        error: (error) => {
          console.error('Error fetching time slots', error);
        },
      });
  }
}
