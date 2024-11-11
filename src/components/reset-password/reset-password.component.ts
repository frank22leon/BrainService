import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
resetPasswordForm: FormGroup<any>;

  

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      console.log('Formulario enviado:', this.resetPasswordForm.value);
      // Aquí puedes añadir la lógica para enviar los datos al backend.
    }
  }

  logout() {
    this.authService.logout();
  }
}