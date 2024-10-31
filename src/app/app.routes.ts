import { Routes } from '@angular/router';

import { LoginComponent } from '../auth/login/login.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';
import { CreateTicketComponent } from '../dashboard/create-ticket/create-ticket.component';
import { ViewTicketsComponent } from '../dashboard_TI/view-tickets/view-tickets.component';
import { RegisterUsersComponent } from '../admin_users/register-users/register-users.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'dashboard/create-ticket', component: CreateTicketComponent },
    { path: 'dashboard_TI/view-tickets', component: ViewTicketsComponent },
    { path: 'admin/register-users', component: RegisterUsersComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirección inicial a login
    { path: '**', redirectTo: '/login' }  // Redirección a login si la ruta no existe
];
