import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service'; // Asegúrate de que esta ruta sea correcta
import { Router } from '@angular/router';

export const requirePasswordChangeGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Verificar si requirePasswordChange es true
  if (authService.requirePasswordChange()) {
    return true; // Permite el acceso
  } else {
    // Redirige a otra ruta si el usuario no necesita cambiar contraseña
    router.navigate(['/login']); // O cualquier otra ruta que consideres
    return false; // Bloquea el acceso
  }
};
