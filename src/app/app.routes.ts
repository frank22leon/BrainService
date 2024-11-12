import { Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';
import { LoginComponent } from '../components/login/login.component';
import { ResetPasswordComponent } from '../components/reset-password/reset-password.component';
import { CreateTicketComponent } from '../components/create-ticket/create-ticket.component';
import { ViewTicketsComponent } from '../components/view-tickets/view-tickets.component';
import { RegisterUsersComponent } from '../components/register-users/register-users.component';
import {ViewTicketsUserComponent} from '../components/view-tickets-user/view-tickets-user.component'
import { DashboardComponent } from '../dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [authGuard]},
      { path: 'create-ticket', component: CreateTicketComponent, canActivate: [authGuard]},
      { path: 'view-tickets', component: ViewTicketsComponent, canActivate: [authGuard]},
      { path: 'view-tickets-user', component: ViewTicketsUserComponent, canActivate: [authGuard]},
      { path: 'register-users', component: RegisterUsersComponent, canActivate: [authGuard]},
      { path: '', redirectTo: 'create-ticket', pathMatch: 'full' }, 
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
