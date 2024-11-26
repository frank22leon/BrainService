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
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../service/notification.service';

@Component({
  selector: 'app-register-users',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register-users.component.html',
  styleUrls: ['./register-users.component.css'], // Corrección del decorador
})
export class RegisterUsersComponent {
  registerForm: FormGroup;
  roles: any[] = []; // Lista para almacenar los roles obtenidos desde la API.
  message: string = '';
  selectedRol: string = '';
  searchRut: string = ''; // Campo de búsqueda por RUT
  userId: number | null = null; // ID del usuario para actualizaciones
  isEditing: boolean = false;

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
formatRut(event: any, targetField?: string) {
  let rut = event.target.value.replace(/[^0-9kK]/g, ''); // Elimina caracteres no válidos
  if (rut.length > 1) {
    rut =
      rut.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') +
      '-' +
      rut.slice(-1); // Formatear
  }

  // Si es el campo del formulario reactivo
  if (targetField === 'rut') {
    this.registerForm.get('rut')?.setValue(rut, { emitEvent: false }); // Actualiza sin disparar validaciones
  }

  // Si es el campo de búsqueda por RUT
  if (targetField === 'searchRut') {
    this.searchRut = rut; // Actualiza el valor de la propiedad `searchRut`
  }
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

      this.registerForm.get('rut')?.enable();
      this.registerForm.get('username')?.enable();
      const { username, rut } = this.registerForm.value;

      // Verificar existencia de RUT o username
      this.authService.checkUserExists(username, rut).subscribe(
        (response: any) => {
          if (response.exists) {
            // Mostrar mensaje específico desde el backend
            this.message = response.message;
            this.notificationService.showErrorCreateUser(this.message);
          } else {
            // Proceder con el registro
            const userData = {
              Usuario: username,
              Clave: this.registerForm.value.password,
              RolId: +this.registerForm.value.role, // Convertir a número
              Rut: rut,
              NombreCompleto: this.registerForm.value.fullName,
            };

            this.authService.registerUser(userData).subscribe(
              (response) => {
                if (response && response.isSuccess) {
                  this.resetForm() 
                  this.registerForm.patchValue({ role: '' });
                  this.message = 'Usuario registrado exitosamente';
                  this.notificationService.showSuccessCreateUser(this.message);
                } else {
                  this.message = 'Error en el registro. Intente nuevamente.';
                  this.notificationService.showErrorCreateUser(this.message);
                }
              },
              (error) => {
                this.message = 'Error en el servidor. Verifique la conexión.';
                this.notificationService.showErrorCreateUser(this.message);
              }
            );
          }
        },
        (error) => {
          console.error('Error al verificar usuario:', error);
        }
      );
    } else {
      this.message = 'Por favor, corrija los errores en el formulario.';
      this.notificationService.showErrorCreateUser(this.message);
    }
  }

  searchUser() {
    const rut = this.searchRut.trim(); // Asegúrate de eliminar espacios en blanco

    if (!rut) {
      this.notificationService.showErrorCreateUser('Ingrese un RUT válido.');
      return;
    }

    this.authService.searchUser(rut).subscribe(
      (response) => {
        if (response && response.isSuccess) {
          const user = response.usuario;
          console.log(user);
          this.registerForm.patchValue({
            rut: user.rut,
            fullName: user.fullName,
            username: user.username,
            password: '', // Incluye el valor de la contraseña si está disponible
            role: user.roleId,
          });

          this.userId = user.userId;
          this.isEditing = true; // Cambia a modo edición
          this.registerForm.get('rut')?.disable(); // Bloquea el campo `rut`
          this.registerForm.get('username')?.disable(); // Bloquea el campo `username`
          this.notificationService.showSuccessCreateUser(
            'Usuario cargado correctamente.'
          );
        } else {
          this.notificationService.showErrorCreateUser(
            'Usuario no encontrado.'
          );
        }
      },
      (error) => {
        // Manejo de errores en caso de que la API falle o el RUT no sea encontrado
        if (error.status === 404) {
          this.notificationService.showErrorCreateUser(
            'Usuario no encontrado.'
          );
        } else {
          this.notificationService.showErrorCreateUser(
            'Error al buscar usuario. Por favor, intente nuevamente.'
          );
        }
      }
    );
  }

  resetForm() {
    this.registerForm.reset();
    this.registerForm.enable(); // Habilita todos los campos del formulario
    this.userId = null;
    this.isEditing = false; // Cambia a modo creación
    this.searchRut = '';
  }

  updateUser() {
    if (this.registerForm.valid) {

      this.registerForm.get('rut')?.enable();
      this.registerForm.get('username')?.enable();
      const { username, rut } = this.registerForm.value;

      if (this.registerForm.valid && this.userId) {
        const userData = {
          UserId: this.userId,
          Usuario: username,
          Clave: this.registerForm.value.password,
          RolId: +this.registerForm.value.role, // Convertir a número
          Rut: rut,
          NombreCompleto: this.registerForm.value.fullName,
        };

        console.log('Datos enviados para actualizar:', userData);

        this.authService.updateUser(userData).subscribe(
          (response) => {
            if (response.isSuccess) {
              this.notificationService.showSuccessCreateUser(
                'Usuario actualizado con éxito.'
              );
              this.resetForm() 
              this.userId = null;
            } else {
              this.notificationService.showErrorCreateUser(
                response.message || 'Error al actualizar usuario.'
              );
            }
          },
          (error) => {
            console.error('Error al actualizar usuario:', error);
            this.notificationService.showErrorCreateUser(
              'Error al actualizar usuario. Por favor, intente nuevamente.'
            );
          }
        );
      } else {
        this.notificationService.showErrorCreateUser(
          'Formulario inválido o falta el ID del usuario.'
        );
      }
    }
  }
}
