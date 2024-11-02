import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/auth.service'; // Importa tu servicio de autenticación
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) { // Verifica si el usuario está autenticado
    return true; // Permite el acceso
  } else {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false; // Bloquea el acceso
  }
};
