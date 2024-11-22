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
}

@Component({
  selector: 'app-view-tickets-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-tickets-user.component.html',
  styleUrl: './view-tickets-user.component.css'
})
export class ViewTicketsUserComponent {

  tickets: any[] = []; // Arreglo para almacenar los tickets
  errorMessage: string = ''; // Mensaje de error, si ocurre

  constructor(
    private ticketService: TicketService,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  statusOptions = ['Pendiente', 'En Proceso', 'Resuelto'];
  priorityOptions = ['Sin Prioridad', 'Alta', 'Media', 'Baja'];
  users = ['Usuario1', 'Usuario2', 'Usuario3'];

  editarTicket(ticket: Ticket) {
    console.log('Ticket a editar:', ticket);
    // Lógica para editar el ticket
  }
  updateTicket(ticket: Ticket): void {
    // Lógica para guardar cambios del ticket en el backend
    console.log('Ticket actualizado:', ticket);
  }

  eliminarTicket(ticket: Ticket) {
    console.log('Ticket a eliminar:', ticket);
    // Lógica para eliminar el ticket
  }

  loadTickets(): void {
    const userId = this.authService.getUsuarioId(); // Obtén el ID del usuario logeado
    
    if (userId) {
      // Cambia aquí a getTicketsByUser(userId)
      this.ticketService.getTicketsByUser(userId).subscribe({
        next: (data: Ticket[]) => { // Especifica el tipo de data
          this.tickets = data; // Asigna los tickets filtrados
        },
        error: (error: any) => { // Especifica el tipo de error
          console.error('Error al cargar los tickets:', error);
          this.errorMessage = 'No se pudieron cargar los tickets.';
        }
      });
    } else {
      console.error('No se encontró el ID del usuario.');
      this.errorMessage = 'No se pudo determinar el usuario logeado.';
    }
  }
  
}