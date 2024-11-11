import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { TicketService } from '../../service/ticket.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css',
})
export class CreateTicketComponent {
  ticketForm!: FormGroup;
  categories: any[] = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ticketService: TicketService
  ) {
    this.ticketForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      solicitante: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories(); // Cargar categorías al inicializar el componente
  }

  loadCategories() {
    this.ticketService.getCategories().subscribe(
      (data: any) => {
        console.log(data); // Verifica que se están cargando correctamente las categorías
        this.categories = data; // Almacenar las categorías
      },
      (error) => {
        console.error('Error al cargar categorías', error);
      }
    );
  }

  createTicketForm() {
    if (this.ticketForm.valid) {
      const createdByUserId = this.authService.getUsuarioId();

      if (createdByUserId) {
        const userId = +createdByUserId; 

        if (!isNaN(userId)) {
          const ticketData = {
            Title: this.ticketForm.value.titulo,
            Description: this.ticketForm.value.descripcion,
            CategoryId: +this.ticketForm.value.categoria, 
            ApplicantName: this.ticketForm.value.solicitante,
            ApplicantEmail: this.ticketForm.value.email,
            ApplicantPhone: this.ticketForm.value.telefono,
            CreatedByUserId: userId, 
          };
          this.createTicket(ticketData);
        } else {
          console.error('El ID de usuario no es válido');
        }
      } else {
        console.error('El ID de usuario no está disponible');
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  createTicket(ticketData: any) {
    this.ticketService.createTicket(ticketData).subscribe(
      (response) => {
        console.log('Ticket creado con éxito', response);
        this.ticketForm.reset();
      },
      (error) => {
        console.error('Error al crear el ticket', error);
      }
    );
  }

  logout(): void {
    this.authService.logout(); 
  }
}
