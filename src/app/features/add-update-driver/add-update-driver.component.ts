import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DriverService } from '../dashboard/services/driver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Driver } from '../dashboard/models/driver.model';
import { TrCompanyResp } from '../../auth/login/models/login.model';
import { LocalStorageService } from '../../core/services/local-storage.service';

@Component({
  selector: 'app-add-update-driver',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-update-driver.component.html',
  styleUrl: './add-update-driver.component.css',
})
export class AddUpdateDriverComponent {
  driverForm!: FormGroup;
  driverId: number | null = null;
  isUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Check if we are updating an existing driver
    this.route.params.subscribe((params) => {
      this.driverId = params['id'] ? +params['id'] : null;
      if (this.driverId) {
        this.isUpdate = true;
        this.loadDriverData(this.driverId);
      }
    });
  }

  private initForm(): void {
    this.driverForm = this.fb.group({
      driverName: ['', Validators.required],
      plateNo: ['', Validators.required],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')],
      ],
    });
  }

  private loadDriverData(id: number): void {
    this.driverService.getDriverById(id).subscribe((driver: Driver) => {
      this.driverForm.patchValue(driver);
    });
  }

  navigateToHome() {
    this.router.navigate(['/dashboard/drivers']);
  }

  onSubmit(): void {
    if (this.driverForm.valid) {
      const driverData = this.driverForm.value as Driver;
      if (this.isUpdate && this.driverId) {
        this.driverService
          .updateDriver(this.driverId, driverData)
          .subscribe(() => {
            this.router.navigate(['/dashboard/drivers']);
          });
      } else {
        const driverDataWithCompanyId = {
          ...driverData,
          trCompanyId: (this.localStorageService.getUserData() as TrCompanyResp)
            .trCompanyId,
        };
        this.driverService.addDriver(driverDataWithCompanyId).subscribe({
          next: (response) => {
            this.router.navigate(['/dashboard/drivers']);
          },
          error: (error) => {
            console.error('Failed to create appointment', error);
          },
        });
      }
    }
  }
}
