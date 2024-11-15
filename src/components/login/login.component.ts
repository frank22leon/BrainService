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
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  message: string = '';
  loginForm!: FormGroup;
  username = '';
  password = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService
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
          this.message = 'Usuario o contraseña incorrectos';
          this.notificationService.showError(this.message);
        } else {
          this.message = 'Error de conexión. Intente nuevamente más tarde.';
          this.notificationService.showError(this.message);
        }
      },
      error: (err) => {
        console.error(err); // Mostrar el error en consola para depuración
        // Mensaje de error de conexión
        this.message = 'Error de conexión. Intente nuevamente más tarde: ' + err;
          this.notificationService.showError(this.message);
      }
    });
  }
}
