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
            // Guarda el token y el refresh token en el localStorage
            sessionStorage.setItem('token', response.token); // Guarda el access token
            sessionStorage.setItem('refreshToken', response.refreshToken); // Guarda el refresh token
            sessionStorage.setItem('usuario', response.usuario);
            sessionStorage.setItem('idUsuario', response.idUser);  // Guarda el nombre de usuario
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
    const refreshToken = sessionStorage.getItem('refreshToken'); // Recupera el refresh token

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
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('usuario');
            sessionStorage.removeItem('idUsuario'); 
          }
          this.router.navigate(['/login']); 
        },
        error: (err) => {
          console.error('Error al cerrar sesión:', err);
        },
      });
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem('token');
      return !!token; // Retorna true si el token existe
    }
    return false; // Retorna false si no está en el navegador
  }

  refreshToken(): Observable<any> {
    const refreshToken = sessionStorage.getItem('refreshToken');
    return this.http.post<any>(`${this.apiUrl}/Acceso/RefreshToken`, {
      refreshToken,
    });
  }

  getUsuario(): string | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage.getItem('usuario') : null;
  }

  getUsuarioId(): string | null {
    return isPlatformBrowser(this.platformId) ? sessionStorage.getItem('idUsuario') : null;
  }

  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Acceso/Roles`);
  }

  registerUser(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Acceso/Registrarse`, data).pipe(
      tap((response) => {
        if (response.isSuccess) {
          console.log('Usuario registrado con éxito:', response);
        }
      }),
      catchError((error) => {
        console.error('Error al registrar usuario:', error);
        return of(null);
      })
    );
  }
  
}
