import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { TicketService } from '../../service/ticket.service';
import { NotificationService } from '../../service/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tick } from '@angular/core/testing';

@Component({
  selector: 'app-view-tickets-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-tickets-admin.component.html',
  styleUrl: './view-tickets-admin.component.css',
})
export class ViewTicketsAdminComponent implements OnInit {
  users: any[] = [];
  tickets: any[] = [];
  groupedTickets: { [key: string]: any[] } = {};
  priorities: any[] = [];
  isLoading: boolean = false;
  Object = Object; // Para usar en *ngFor en el HTML

  constructor(
    private authService: AuthService,
    private ticketService: TicketService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadPriorities();
    this.loadTickets();
  }

  loadUsers() {
    this.ticketService.getAssignableUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios asignables:', err);
      },
    });
  }

  getSelectedUserName(userId: number | null): string {
    const user = this.users.find((u) => u.userId === userId);
    return user ? user.fullName : 'Seleccionar';
  }
  

  loadPriorities() {
    this.ticketService.getPriorities().subscribe((data) => {
      this.priorities = data;
    });
  }

  loadTickets() {
    this.isLoading = true;
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data.map((ticket) => ({
          ...ticket,
          assignedUserId: ticket.assignedUserId || null,
          priorityId: ticket.priorityId || null,
        }));
        this.groupTicketsByStatus();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar tickets:', err);
        this.isLoading = false;
      },
    });
  }

  groupTicketsByStatus(): void {
    this.groupedTickets = this.tickets.reduce((acc, ticket) => {
      const status = ticket.status || 'Sin Estado';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(ticket);
      return acc;
    }, {} as { [key: string]: any[] });
  
    // Ordena las claves en un orden específico
    this.groupedTickets = Object.keys(this.groupedTickets)
      .sort((a, b) => this.getStatusOrder(a) - this.getStatusOrder(b))
      .reduce((acc, key) => {
        acc[key] = this.groupedTickets[key];
        return acc;
      }, {} as { [key: string]: any[] });
  }
  
  getStatusOrder(status: string): number {
    // Define el orden de los estados
    const orderMap: { [key: string]: number } = {
      'Pendiente': 1,
      'En Progreso': 2,
      'Resuelto': 3,
      'Sin Asignar': 4,
    };
    return orderMap[status] || 999; // Coloca estados no especificados al final
  }
  

  assignUser(ticket: any) {
    if (!ticket.assignedUserId) {
      this.notificationService.showError('Selecciona un usuario para asignar.');
      return;
    }
  
    // Guardar el estado inicial del ticket antes del cambio
    const initialStatus = ticket.status;
  
    this.ticketService
      .assignUserToTicket(ticket.ticketId, ticket.assignedUserId)
      .subscribe({
        next: () => {
          // Actualizar localmente el estado solo si era "Sin Asignar"
          if (initialStatus === 'Pendiente') {
            ticket.status = 'En Progreso'; // Cambiar estado localmente
            this.groupTicketsByStatus(); // Reagrupar los tickets para reflejar el cambio
          }
        },
        error: () => {
          console.log('Error al asignar el ticket.');
        },
      });
  }
  

  updatePriority(ticket: any) {
    if (!ticket.priorityId) {
      this.notificationService.showError('Selecciona una prioridad.');
      return;
    }

    this.ticketService
      .updateTicketPriority(ticket.ticketId, ticket.priorityId)
      .subscribe({
        next: () => {
          console.log('Prioridad actualizada correctamente.');
        },
        error: () => {
          this.notificationService.showError(
            'Error al actualizar la prioridad.'
          );
        },
      });
  }
}
