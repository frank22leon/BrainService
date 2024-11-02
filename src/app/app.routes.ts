import { Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';
import { LoginComponent } from '../auth/login/login.component';
import { ResetPasswordComponent } from '../auth/reset-password/reset-password.component';
import { CreateTicketComponent } from '../dashboard/create-ticket/create-ticket.component';
import { ViewTicketsComponent } from '../dashboard_TI/view-tickets/view-tickets.component';
import { RegisterUsersComponent } from '../admin_users/register-users/register-users.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'reset-password', component: ResetPasswordComponent,canActivate: [authGuard] },
    { path: 'dashboard/create-ticket', component: CreateTicketComponent, canActivate: [authGuard] },
    { path: 'dashboard_TI/view-tickets', component: ViewTicketsComponent, canActivate: [authGuard] },
    { path: 'admin/register-users', component: RegisterUsersComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
