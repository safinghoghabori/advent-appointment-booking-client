import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registrationForm: FormGroup;
  selectedRole: string | null = null;

  constructor(private fb: FormBuilder) {
    this.registrationForm = this.fb.group({
      role: ['', Validators.required],
      truckingCompany: this.fb.group({
        companyName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        gstNumber: ['', Validators.required],
        transportLicNo: ['', Validators.required],
      }),
      terminal: this.fb.group({
        portName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
      }),
    });

    this.toggleRoleFields(); // Initially hide all fields
  }

  toggleRoleFields(): void {
    // Reset role-specific form sections
    this.selectedRole = this.registrationForm.get('role')?.value;
    if (this.selectedRole === 'truckingCompany') {
      this.registrationForm.get('truckingCompany')?.enable();
      this.registrationForm.get('terminal')?.disable();
    } else if (this.selectedRole === 'terminal') {
      this.registrationForm.get('terminal')?.enable();
      this.registrationForm.get('truckingCompany')?.disable();
    } else {
      this.registrationForm.get('truckingCompany')?.disable();
      this.registrationForm.get('terminal')?.disable();
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
      // Handle form submission here
    }
  }
}
