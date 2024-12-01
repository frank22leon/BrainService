import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../service/ticket.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Ticket {
  ticketId: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  createdDate: string;
  createdByUser: string;
  assignedUserName: string;
}

@Component({
  selector: 'app-view-tickets-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-tickets-user.component.html',
  styleUrl: './view-tickets-user.component.css',
})
export class ViewTicketsUserComponent {
  tickets: Ticket[] = [];
  groupedTickets: { [key: string]: Ticket[] } = {};
  errorMessage: string = '';
  expandedTickets: Set<number> = new Set();
  isLoading: boolean = false;

  // Se importa explícitamente Object para usarlo en la plantilla
  Object = Object;

  constructor(
    private ticketService: TicketService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }
  
  loadTickets(): void {
    this.isLoading = true;
    const userId = this.authService.getUsuarioId();
    if (userId) {
      this.ticketService.getTicketsByUser(userId).subscribe({
        next: (data: Ticket[]) => {
          this.tickets = data;
          this.groupTicketsByStatus();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al cargar los tickets:', error);
          this.errorMessage = 'No se pudieron cargar los tickets.';
          this.isLoading = false;
        },
      });
    } else {
      console.error('No se encontró el ID del usuario.');
      this.errorMessage = 'No se pudo determinar el usuario logeado.';
      this.isLoading = false;
    }
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

  toggleDetails(ticketId: number): void {
    if (this.expandedTickets.has(ticketId)) {
      this.expandedTickets.delete(ticketId);
    } else {
      this.expandedTickets.add(ticketId);
    }
  }
}
