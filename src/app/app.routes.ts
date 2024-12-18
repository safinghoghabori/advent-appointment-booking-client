import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { CommonComponent } from './layout/common/common.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NewAppointmentComponent } from './features/new-appointment/new-appointment.component';
import { AppointmentListComponent } from './features/appointment-list/appointment-list.component';
import { DriverListComponent } from './features/driver-list/driver-list.component';
import { AddUpdateDriverComponent } from './features/add-update-driver/add-update-driver.component';
import { UpdateAppointmentComponent } from './features/update-appointment/update-appointment.component';
import { AuthGuard } from './core/guards/auth.guard';
import { UnAuthGuard } from './core/guards/un-auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: CommonComponent,
    children: [
      { path: '', component: LandingPageComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
    canActivate: [UnAuthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: AppointmentListComponent },
      { path: 'new-appointment', component: NewAppointmentComponent },
      {
        path: 'update-appointment/:id',
        component: UpdateAppointmentComponent,
      },
      {
        path: 'drivers',
        component: DriverListComponent,
        // children: [{ path: 'add', component: AddUpdateDriverComponent }],
      },
      { path: 'drivers/add', component: AddUpdateDriverComponent },
      { path: 'drivers/update/:id', component: AddUpdateDriverComponent },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', component: PageNotFoundComponent }, // Catch-all for invalid routes
];
