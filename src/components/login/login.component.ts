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
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm!: FormGroup;
  username = '';
  password = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  NgOnInit() {
    if (this.authService.isAuthenticated()) {
      console.log('autenticado');
    } else {
      console.log('NO autenticado');
    }
  }

  loginUser(): void {
    const formData = {
      usuario: this.loginForm.value.usuario,
      clave: this.loginForm.value.password,
    };

    this.authService.login(formData).subscribe({
      next: (response) => {
        console.log(response); // Para ver la respuesta completa en consola

        if (response && response.isSuccess) {
          // Si isSuccess es true, permite el acceso
          this.router.navigate(['/dashboard/create-ticket']);
        } else if (response && !response.isSuccess) {
          // Si isSuccess es false, indica usuario o contraseña incorrectos
          alert('Usuario o contraseña incorrectos');
        } else {
          // Si no hay respuesta válida, indica error de conexión
          alert('Error de conexión. Intente nuevamente más tarde.');
        }
      },
      error: (err) => {
        console.error(err); // Mostrar el error en consola para depuración
        // Mensaje de error de conexión
        alert('Error de conexión. Intente nuevamente más tarde.');
      }
    });
  }
}
