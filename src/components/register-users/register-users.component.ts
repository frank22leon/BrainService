import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-register-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-users.component.html',
  styleUrls: ['./register-users.component.css'], // Corrección del decorador
})
export class RegisterUsersComponent {
  registerForm: FormGroup;
  roles: any[] = []; // Lista para almacenar los roles obtenidos desde la API.
  message: string = '';
  selectedRol: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.registerForm = this.fb.group({
      rut: ['', [Validators.required, this.rutValidator]],
      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(90),
          Validators.minLength(1),
          this.fullNameValidator(),
        ],
      ],
      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.minLength(1),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      role: ['', Validators.required],
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
        this.roles = data; // Asigna los roles obtenidos a la propiedad roles.
      },
      (error) => {
        console.error('Error al cargar los roles', error);
      }
    );
  }

  // Método para formatear el RUT en tiempo real
  formatRut(event: any) {
    let rut = event.target.value.replace(/[^0-9kK]/g, ''); // Elimina caracteres no válidos
    if (rut.length > 1) {
      rut =
        rut.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
        '-' +
        rut.slice(-1); // Formatear
    }
    this.registerForm.get('rut')?.setValue(rut, { emitEvent: false }); // Actualiza sin disparar validaciones
  }

  // Validador de RUT
  rutValidator(control: AbstractControl): ValidationErrors | null {
    const rut = control.value?.replace(/\./g, '').replace('-', ''); // Limpia el RUT
    if (!rut || rut.length < 9) return { invalidRut: true };

    const body = rut.slice(0, -1);
    const verifier = rut.slice(-1).toLowerCase();

    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedVerifier = 11 - (sum % 11);
    const actualVerifier = verifier === 'k' ? 10 : parseInt(verifier, 10);
    return expectedVerifier === actualVerifier ||
      (expectedVerifier === 11 && actualVerifier === 0)
      ? null
      : { invalidRut: true };
  }
  fullNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Si está vacío, no se aplica el validador de formato
      }

      const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/; // Solo letras, espacios y tildes
      const valid = regex.test(control.value);
      return valid ? null : { invalidFullName: true }; // Si no es válido, devuelve el error
    };
  }

  get role() {
    return this.registerForm.get('role');
  }

  // Manejar el cambio en el selector de roles
  onSelectChange(event: any) {
    this.selectedRol = event.target.value; // Actualiza la categoría seleccionada
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
      this.authService.registerUser(userData).subscribe(
        (response) => {
          if (response && response.isSuccess) {
            this.registerForm.reset();
            this.registerForm.patchValue({
              role: '' 
            });
            this.message = 'Usuario registrado exitosamente';

            this.notificationService.showSuccessCreateUser(this.message);
            console.log(this.message);
          } else {
            this.message = 'Error en el registro. Intente nuevamente.';
            this.notificationService.showErrorCreateUser(this.message);
            console.error(this.message);
          }
        },
        (error) => {
          this.message = 'Error en el servidor. Verifique la conexión.';
          this.notificationService.showErrorCreateUser(this.message);
          console.error(error);
        }
      );
    } else {
      this.message = 'Por favor, corrija los errores en el formulario.';
      this.notificationService.showErrorCreateUser(this.message);
      console.warn(this.message);
    }
  }
}
