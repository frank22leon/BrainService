import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../service/ticket.service';
import { NotificationService } from '../../service/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-view-tickets-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-tickets-soporte.component.html',
  styleUrl: './view-tickets-soporte.component.css',
})
export class ViewTicketsSoporteComponent implements OnInit {
  tickets: any[] = [];
  groupedTickets: { [key: string]: any[] } = {};
  resolutionMessage: { [key: number]: string } = {};
  isLoading: boolean = false;

  Object = Object; // Exponer Object para usarlo en la plantilla

  constructor(
    private ticketService: TicketService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.isLoading = true;

    const userId = this.authService.getUsuarioId();
    if (!userId) {
      console.error('No se encontró el ID del usuario.');
      this.isLoading = false;
      return;
    }

    this.ticketService.getAssignedTickets(Number(userId)).subscribe({
      next: (data: any) => {
        this.tickets = data;
        this.groupTicketsByStatus();
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error al cargar tickets asignados:', err);
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
      'En Progreso': 1,
      'Resuelto': 2,
      'Sin Asignar': 3,
    };
    return orderMap[status] || 999; // Coloca estados no especificados al final
  }
  

  resolveTicket(ticket: any): void {
    const message = this.resolutionMessage[ticket.ticketId];
    if (!message) {
      this.notificationService.showError('Debe ingresar un mensaje.');
      return;
    }

    this.ticketService.resolveTicket(ticket.ticketId, message).subscribe({
      next: () => {
        this.notificationService.showSuccess('Ticket resuelto correctamente.');
        ticket.status = 'Resuelto';
        ticket.resolutionMessage = message; // Actualizar el mensaje localmente
        this.groupTicketsByStatus();
      },
      error: () => {
        this.notificationService.showError('Error al resolver el ticket.');
      },
    });
  }
}
