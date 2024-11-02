import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
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
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!: FormGroup;
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,) {
    this.loginForm = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  NgOnInit(){ 
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

    this.authService.login(formData).subscribe(response => {
      console.log(response);  // Agrega esto para ver la respuesta completa
      if (response && response.isSuccess) {
        this.router.navigate(['/dashboard/create-ticket']);  
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    });
  }
}
