import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Ticket {
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  createdDate: string;
  assignedUser: string;
}


@Component({
  selector: 'app-view-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-tickets.component.html',
  styleUrl: './view-tickets.component.css'
})
export class ViewTicketsComponent {

  tickets: Ticket[] = [
    {
      title: 'Prueba',
      description: 'Prueba creación Ticket',
      status: 'Pendiente',
      priority: 'Sin Prioridad',
      category: 'Soporte Técnico',
      applicantName: 'Francisco',
      applicantEmail: 'prueba@gmail.com',
      applicantPhone: '123',
      createdDate: '2024-11-09T22:25:57.563',
      assignedUser: ''
    },
    // Agrega más tickets según sea necesario
  ];

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
}