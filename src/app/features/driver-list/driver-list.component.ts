import { Component } from '@angular/core';
import { Driver } from '../dashboard/models/driver.model';
import { DriverService } from '../dashboard/services/driver.service';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TrCompanyResp } from '../../auth/login/models/login.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.css',
})
export class DriverListComponent {
  drivers: Driver[] = [];

  constructor(
    private driverService: DriverService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    const trCompanyData = this.authService.getUserData() as TrCompanyResp;

    this.driverService.getDrivers(trCompanyData.trCompanyId).subscribe({
      next: (data) => {
        this.drivers = data;
      },
      error: (error) => {
        console.error('Error fetching drivers', error);
      },
    });
  }

  addDriver(): void {
    this.router.navigate(['dashboard/drivers/add']);
  }

  updateDriver(id: number): void {
    this.router.navigate([`/dashboard/drivers/update/${id}`]);
  }

  deleteDriver(id: number): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.driverService.deleteDriver(id).subscribe(() => {
        this.loadDrivers(); // Reload the list after deletion
      });
    }
  }
}
