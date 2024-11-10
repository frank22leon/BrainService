import { Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';
import { LoginComponent } from '../components/login/login.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { CreateTicketComponent } from '../components/create-ticket/create-ticket.component';
import { ViewTicketsComponent } from '../components/view-tickets/view-tickets.component';
import { RegisterUsersComponent } from '../components/register-users/register-users.component';
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
