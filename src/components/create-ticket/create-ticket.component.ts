import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { TicketService } from '../../service/ticket.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
})
export class CreateTicketComponent implements OnInit {
  ticketForm!: FormGroup;
  categories: any[] = [];
  message: string = '';
  selectedCategory: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private ticketService: TicketService,
    private notificationService: NotificationService
  ) {
    this.ticketForm = this.fb.group({
      titulo: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(200)],
      ],
      descripcion: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(500)],
      ],
      categoria: ['', Validators.required],
      solicitante: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/), Validators.maxLength(90)],
      ],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(90)]],
      telefono: [
        '',
        [Validators.required, Validators.pattern(/^(\+56|56)?9\d{8}$/), Validators.maxLength(12)],
      ],
    });
    
  }

  ngOnInit(): void {
    this.loadCategories(); // Cargar categorías al inicializar el componente
  }

  get titulo() {
    return this.ticketForm.get('titulo');
  }
  get descripcion() {
    return this.ticketForm.get('descripcion');
  }
  get categoria() {
    return this.ticketForm.get('categoria');
  }
  get solicitante() {
    return this.ticketForm.get('solicitante');
  }
  get email() {
    return this.ticketForm.get('email');
  }
  get telefono() {
    return this.ticketForm.get('telefono');
  }

  formatPhoneNumber(event: any): void {
    const inputValue = event.target.value;
    const formattedValue = inputValue.replace(/\s+/g, ''); // Elimina los espacios en blanco
    this.ticketForm.controls['telefono'].setValue(formattedValue); // Actualiza el valor en el formulario
  }
  loadCategories() {
    this.ticketService.getCategories().subscribe(
      (data: any) => {
        console.log('Categorías cargadas:', data); // Verifica que las categorías se cargan correctamente
        this.categories = data;
      },
      (error) => {
        console.error('Error al cargar categorías:', error);
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
          console.error('El ID de usuario no es válido.');
        }
      } else {
        console.error('El ID de usuario no está disponible.');
      }
    } else {
      this.message = 'Completa todos los campos.';
      this.notificationService.showErrorCreateTicket(this.message);
      console.log('Formulario no válido.');
    }
  }

  createTicket(ticketData: any) {
    this.ticketService.createTicket(ticketData).subscribe(
      (response) => {
        this.message = 'Ticket enviado con éxito.';
        this.notificationService.showSuccessCreateTicket(this.message);
        console.log('Ticket creado con éxito:', response);
        this.ticketForm.reset();
        this.ticketForm.patchValue({
          categoria: '' // Esto asegura que el select vuelva a mostrar "Selecciona un Rol"
        });
      },
      (error) => {
        this.message = 'Error al crear el ticket: ';
        this.notificationService.showErrorCreateTicket(this.message + error);
        console.error('Error al crear el ticket:', error);
      }
    );
  }

  onSelectChange(event: any) {
    this.selectedCategory = event.target.value; // Actualiza la categoría seleccionada
  }
}
