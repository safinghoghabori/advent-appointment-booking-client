import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { TrCompanyResp } from '../../auth/login/models/login.model';
import { AppointmentService } from '../dashboard/services/appointment.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-update-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-appointment.component.html',
  styleUrl: './update-appointment.component.css',
})
export class UpdateAppointmentComponent {
  appointmentForm: FormGroup;
  trCompanyData: TrCompanyResp;
  availableTimeSlots: string[] = [];
  errorMessage: string = '';
  appointmentId: string | null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.trCompanyData = this.authService.getUserData() as TrCompanyResp;
    this.appointmentId = this.route.snapshot.paramMap.get('id');

    this.appointmentForm = this.fb.group({
      appointmentDate: ['', Validators.required],
      timeSlot: ['', Validators.required],
    });
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

  onSubmit(): void {
    if (this.appointmentForm.valid) {
      const updatedInfo = this.appointmentForm.value;
      const appointmentId = Number(this.appointmentId);

      this.appointmentService
        .updateAppointmentDateTime(appointmentId, updatedInfo)
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (error: any) => {
            console.log('Error updating appointment.', error.error.message);
          },
        });
    }

    this.errorMessage = 'Please enter required fields.';
  }
}
