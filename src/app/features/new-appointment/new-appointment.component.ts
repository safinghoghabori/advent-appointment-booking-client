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

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private driverService: DriverService,
    private authService: AuthService,
    private terminalService: TerminalService,
    private router: Router
  ) {
    this.appointmentForm = this.fb.group({
      terminalId: ['', Validators.required],
      driverId: ['', Validators.required],
      containerNumber: ['', Validators.required],
      moveType: ['', Validators.required],
      sizeType: ['', Validators.required],
      line: ['', Validators.required],
      needChassis: [false],
      chassisNo: [''],
    });

    // Listen to changes in the toggle switch for chassis
    this.appointmentForm
      .get('needChassis')
      ?.valueChanges.subscribe((needChassis) => {
        this.toggleChassisField(needChassis);
      });
  }

  ngOnInit(): void {
    this.trCompanyData = this.authService.getUserData() as TrCompanyResp;
    this.loadTerminals();
    this.loadDrivers();

    // this.appointmentId = this.route.snapshot.paramMap.get('id');
    // if (this.appointmentId) {
    //   this.isEditMode = true;
    //   this.loadAppointmentData(this.appointmentId);
    // }
  }

  // Toggle the chassis number field validation and visibility
  private toggleChassisField(needChassis: boolean) {
    const chassisControl = this.appointmentForm.get('chassisNumber');

    if (needChassis) {
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

        // Handle case when no drivers available
        if (!this.drivers || this.drivers.length === 0) {
          alert('No drivers available. Please add a driver first.');
          this.router.navigate(['/add-driver']);
        }
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
        error: (error) => console.error('Failed to create appointment', error),
      });
    }
  }
}
