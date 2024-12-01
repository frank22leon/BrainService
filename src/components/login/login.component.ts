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
        console.log(response); // Para depuración: muestra la respuesta completa en consola.

        if (response && response.requirePasswordChange) {
          // Si requiere cambiar contraseña, redirige al componente correspondiente
          this.router.navigate(['/change-password']);
        } else if (response && response.isSuccess) {
          // Si isSuccess es true, permite el acceso al dashboard
          this.router.navigate(['/dashboard/create-ticket']);
        } else {
          // Si isSuccess es false y no requiere cambiar contraseña, muestra un error
          this.message = 'Usuario o contraseña incorrectos';
          this.notificationService.showErrorLogin(this.message);
        }
      },
      error: (err) => {
        console.error(err); // Mostrar el error en consola para depuración
        this.message = 'Error de conexión. Intente nuevamente más tarde: ' + err;
        this.notificationService.showErrorLogin(this.message);
      },
    });
  }
  
  
}
