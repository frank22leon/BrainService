import { HttpInterceptorFn, HttpEvent, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { AuthService } from '../service/auth.service'; // Asegúrate de que la ruta es correcta
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const token = localStorage.getItem('token');

  // Clona la solicitud para añadir el header de autorización
  const clonedReq = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(clonedReq).pipe(
    catchError((error) => {
      // Manejo de errores
      if (error.status === 401) {
        // Si el token ha expirado, intenta refrescarlo
        return authService.refreshToken().pipe(
          switchMap((response: any) => {
            if (response && response.token) {
              // Si el refresco es exitoso, guarda el nuevo token y repite la solicitud original
              localStorage.setItem('token', response.token);
              const newReq = clonedReq.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`
                }
              });
              return next(newReq); // Repite la solicitud con el nuevo token
            } else {
              authService.logout(); // Si no hay nuevo token, cierra sesión
              return throwError('No se pudo refrescar el token.');
            }
          }),
          catchError((err) => {
            // Manejo de errores si el refresco también falla
            authService.logout();
            return throwError(err);
          })
        );
      }
      // Si no es un error 401, simplemente se lanza el error original
      return throwError(error);
    })
  );
};


