import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-users',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-users.component.html',
  styleUrl: './register-users.component.css'
})
export class RegisterUsersComponent {
  registerForm: FormGroup;
  roles = ['Administrador', 'Soporte', 'Usuario'];

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;
      console.log('Usuario registrado:', userData);
      // Aquí puedes agregar el servicio para registrar el usuario
    } else {
      console.log('Formulario no válido');
    }
  }
}
