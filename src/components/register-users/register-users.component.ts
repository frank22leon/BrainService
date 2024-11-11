import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-users.component.html',
  styleUrl: './register-users.component.css',
})
export class RegisterUsersComponent {
  registerForm: FormGroup;
  roles: any[] = []; // Lista para almacenar los roles obtenidos desde la API.

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      rut: ['', Validators.required],
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required], // Será el RolId directamente
    });
  }

  ngOnInit() {
    this.loadRoles();
  }

  // Método para cargar los roles desde la API
  loadRoles() {
    this.authService.getRoles().subscribe(
      (data: any[]) => {
        console.log('Datos recibidos de la API:', data); // Verifica qué datos se están recibiendo
        this.roles = data; // Asigna los roles obtenidos a la propiedad `roles`.
      },
      (error) => {
        console.error('Error al cargar los roles', error);
      }
    );
  }

  registerUser() {
    if (this.registerForm.valid) {
      const userData = {
        Usuario: this.registerForm.value.username,
        Clave: this.registerForm.value.password,
        RolId: +this.registerForm.value.role, // Asegúrate de que sea un número
        Rut: this.registerForm.value.rut,
        NombreCompleto: this.registerForm.value.fullName,
      };
      console.log(userData);
      this.authService.registerUser(userData).subscribe((response) => {
        if (response && response.isSuccess) {
          this.registerForm.reset();
          console.log('Usuario registrado exitosamente');
        } else {
          console.log('Error en el registro');
        }
      });
    } else {
      console.log('Formulario no válido');
    }
  }
}

