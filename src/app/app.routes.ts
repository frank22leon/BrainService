import { Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';
import { requirePasswordChangeGuard } from '../guard/require-password-change.guard';
import { LoginComponent } from '../components/login/login.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';
import { CreateTicketComponent } from '../components/create-ticket/create-ticket.component';
import { RegisterUsersComponent } from '../components/register-users/register-users.component';
import { ViewTicketsAdminComponent } from '../components/view-tickets-admin/view-tickets-admin.component';
import { ViewTicketsSoporteComponent } from '../components/view-tickets-soporte/view-tickets-soporte.component';
import { ViewTicketsUserComponent } from '../components/view-tickets-user/view-tickets-user.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [requirePasswordChangeGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'create-ticket',
        component: CreateTicketComponent,
        canActivate: [authGuard],
      },
      {
        path: 'view-tickets-admin',
        component: ViewTicketsAdminComponent,
        canActivate: [authGuard],
      },
      {
        path: 'view-tickets-soporte',
        component: ViewTicketsSoporteComponent,
        canActivate: [authGuard],
      },
      {
        path: 'view-tickets-user',
        component: ViewTicketsUserComponent,
        canActivate: [authGuard],
      },
      {
        path: 'register-users',
        component: RegisterUsersComponent,
        canActivate: [authGuard],
      },
      { path: '', redirectTo: 'create-ticket', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
