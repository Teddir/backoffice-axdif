import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardEmployeeStatsComponent } from './components/dashboard-employee-stats/dashboard-employee-stats.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard/overview', pathMatch: 'full' },
  { path: 'registration', component: RegistrationComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard/overview', component: DashboardOverviewComponent, canActivate: [authGuard] },
  { path: 'dashboard/employee-stats', component: DashboardEmployeeStatsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/registration' }
];
