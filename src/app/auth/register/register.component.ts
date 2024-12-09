import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserType } from '../login/models/login.model';
import { AuthService } from '../../core/services/auth.service';
import { TerminalFormData, TrCompanyFormData } from './models/register.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registrationForm: FormGroup;
  userType = UserType;
  selectedRole: UserType | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registrationForm = this.fb.group({
      role: ['', Validators.required],
      truckingCompany: this.fb.group({
        trCompanyName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        gstNo: ['', Validators.required],
        transportLicNo: ['', Validators.required],
      }),
      terminal: this.fb.group({
        portName: ['', Validators.required],
        terminalName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });

    // Initially hide all fields
    this.toggleRoleFields();
  }

  toggleRoleFields(): void {
    // Reset role-specific form sections
    this.selectedRole = this.registrationForm.get('role')?.value;
    if (this.selectedRole === UserType.TruckingCompany) {
      this.registrationForm.get('truckingCompany')?.enable();
      this.registrationForm.get('terminal')?.disable();
    } else if (this.selectedRole === UserType.Terminal) {
      this.registrationForm.get('terminal')?.enable();
      this.registrationForm.get('truckingCompany')?.disable();
    } else {
      this.registrationForm.get('truckingCompany')?.disable();
      this.registrationForm.get('terminal')?.disable();
    }
  }

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      return;
    }

    this.isLoading = true;
    const role = this.registrationForm.get('role')?.value;
    let userData: TrCompanyFormData | TerminalFormData;

    if (this.selectedRole === UserType.TruckingCompany) {
      userData = this.registrationForm.get('truckingCompany')?.value;
    } else {
      userData = this.registrationForm.get('terminal')?.value;
    }

    this.authService.register(userData, role).subscribe({
      next: (response) => {
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error;
      },
    });
  }
}
