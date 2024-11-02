import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7159/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Acceso/Login`, data).pipe(
      tap((response) => {
        if (response.isSuccess) {
          if (isPlatformBrowser(this.platformId)) {
            // Guardamos el token y el refresh token en el localStorage
            localStorage.setItem('token', response.token); // Guarda el access token
            localStorage.setItem('refreshToken', response.refreshToken); // Guarda el refresh token
          }
        }
      }),
      catchError((error) => {
        console.error('Error en el login:', error);
        return of(null); // Devuelve un observable vacío en caso de error
      })
    );
  }

  logout(): void {
    const refreshToken = localStorage.getItem('refreshToken'); // Recupera el refresh token

    // Comprueba si el refresh token existe
    if (!refreshToken) {
      console.error('No hay refresh token disponible');
      return; // Salir si no hay refresh token
    }

    // Envía la solicitud a la API para cerrar sesión
    this.http
      .post(
        `${this.apiUrl}/Acceso/CerrarSesion`,
        JSON.stringify(refreshToken),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .subscribe({
        next: () => {
          if (isPlatformBrowser(this.platformId)) {
            // Eliminar ambos tokens del localStorage al cerrar sesión
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
          this.router.navigate(['/login']); // Redirigir a la página de login
        },
        error: (err) => {
          console.error('Error al cerrar sesión:', err);
          // Manejo de errores en el cierre de sesión, si es necesario
        },
      });
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      return !!token; // Retorna true si el token existe
    }
    return false; // Retorna false si no está en el navegador
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/Acceso/RefreshToken`, {
      refreshToken,
    });
  }
}
