import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../service/notification.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  message: string = '';
  showPassworChange: boolean = false;
  showConfirmPassworChange: boolean = false;
  passwordsMatch: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.changePasswordForm = this.fb.group({
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          this.passwordStrengthValidator(),
        ],
      ],
      confirmNewPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
    });
    this.changePasswordForm.valueChanges.subscribe(() => {
      this.validatePasswords();
    });
  }

  validatePasswords() {
    const newPassword = this.changePasswordForm.get('newPassword')?.value;
    const confirmNewPassword =
      this.changePasswordForm.get('confirmNewPassword')?.value;
    this.passwordsMatch = newPassword === confirmNewPassword; // Actualiza si las contraseñas coinciden
  }

  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (!value) return null;

      // Validar: Al menos 1 letra, 1 carácter especial, y 3 números
      const hasLetter = /[a-zA-Z]/.test(value);
      const hasSpecial = /[@$!%*?&]/.test(value);
      const hasThreeNumbers = /\d.*\d.*\d/.test(value);

      const passwordValid = hasLetter && hasSpecial && hasThreeNumbers;

      return !passwordValid ? { passwordStrength: true } : null;
    };
  }

  changePassword() {
    if (this.changePasswordForm.invalid || !this.passwordsMatch) {
      this.message = 'Por favor, asegúrate de que las contraseñas coincidan.';
      this.notificationService.showErrorLogin(this.message);
      return;
    }

    const { newPassword } = this.changePasswordForm.value;

    this.authService
      .changePassword({ newPassword }) // Asume un método que maneja esta lógica
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.message = 'Contraseña actualizada exitosamente.';
            this.notificationService.showSuccessCreateUser(this.message);
            this.router.navigate(['/login']); // Redirigir al login después del cambio
          } else {
            this.message = response.message || 'Error al cambiar contraseña.';
            this.notificationService.showErrorLogin(this.message);
          }
        },
        error: (err) => {
          this.message = 'Error al cambiar contraseña. Intente más tarde.';
          this.notificationService.showErrorLogin(this.message);
        },
      });
  }

  togglePasswordVisibilityChange() {
    this.showPassworChange = !this.showPassworChange;
  }

  togglePasswordVisibilityChangeConfirm() {
    this.showConfirmPassworChange = !this.showConfirmPassworChange;
  }
}
