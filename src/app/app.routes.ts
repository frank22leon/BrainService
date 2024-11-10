import { Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';
import { LoginComponent } from '../auth/login/login.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';
import { CreateTicketComponent } from '../dashboard/create-ticket/create-ticket.component';
import { ViewTicketsComponent } from '../dashboard_TI/view-tickets/view-tickets.component';
import { RegisterUsersComponent } from '../admin_users/register-users/register-users.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'create-ticket', component: CreateTicketComponent },
      { path: 'view-tickets', component: ViewTicketsComponent },
      { path: 'register-users', component: RegisterUsersComponent },
      { path: '', redirectTo: 'create-ticket', pathMatch: 'full' }, 
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
