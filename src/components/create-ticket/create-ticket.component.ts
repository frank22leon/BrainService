import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
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
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent {
  ticketForm!: FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService) { 
    this.ticketForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      prioridad: ['', Validators.required],
      categoria: ['', Validators.required],
      solicitante: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9,15}$/)]],
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.ticketForm.valid) {
      const ticketData = this.ticketForm.value;
      console.log('Ticket enviado:', ticketData);
      // Aquí puedes agregar el servicio para enviar el ticket a la API
    } else {
      console.log('Formulario no válido');
    }
  }

  logout(): void {
    this.authService.logout(); // Aquí llamas al servicio para cerrar sesión
  }
}
