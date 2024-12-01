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
  private apiUrl = 'https://apibrainservice.somee.com/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Login/Login`, data).pipe(
      tap((response) => {
        if (response.isSuccess) {
          if (isPlatformBrowser(this.platformId)) {
            // Guarda el token y otros datos en sessionStorage
            sessionStorage.setItem('token', response.token);
            sessionStorage.setItem('refreshToken', response.refreshToken);
            sessionStorage.setItem('usuario', response.usuario);
            sessionStorage.setItem('idUsuario', response.idUser);
            sessionStorage.setItem('role', response.rol);
            sessionStorage.setItem('requirePasswordChange', 'false'); // Marcamos que no requiere cambio
          }
        } else if (response.requirePasswordChange) {
          if (isPlatformBrowser(this.platformId)) {
            // Solo guarda esta información si requiere cambiar la contraseña
            sessionStorage.setItem('requirePasswordChange', 'true');
            sessionStorage.setItem('usuario', response.usuario);
            sessionStorage.setItem('idUsuario', response.idUser);
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
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('requirePasswordChange');
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
    return isPlatformBrowser(this.platformId)
      ? sessionStorage.getItem('usuario')
      : null;
  }

  getUsuarioId(): string | null {
    return isPlatformBrowser(this.platformId)
      ? sessionStorage.getItem('idUsuario')
      : null;
  }

  getUserRole(): string | null {
    return isPlatformBrowser(this.platformId)
      ? sessionStorage.getItem('role') // Suponiendo que el rol está almacenado como 'role'
      : null;
  }
  
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Acceso/Users`).pipe(
      catchError((error) => {
        console.error('Error al obtener la lista de usuarios:', error);
        return of([]); // Devuelve un arreglo vacío en caso de error
      })
    );
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

  checkUserExists(username: string, rut: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Acceso/CheckUserExists`, {
      params: { username, rut },
    });
  }

  // Método para buscar un usuario por RUT o username
  // Método para buscar un usuario por RUT o username// Método para buscar un usuario por RUT
  searchUser(rut: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Acceso/BuscarUsuario`, {
      params: { rut },
    });
  }

  // Método para actualizar un usuario existente
  updateUser(data: any): Observable<any> {
    console.log('Datos enviados al backend:', data);
    return this.http
      .put<any>(`${this.apiUrl}/Acceso/ActualizarUsuario`, data)
      .pipe(
        tap((response) => {
          if (response.isSuccess) {
            console.log('Usuario actualizado con éxito:', response);
          }
        }),
        catchError((error) => {
          console.error('Error al actualizar usuario:', error);
          return of({
            isSuccess: false,
            message: 'Error al actualizar usuario',
          });
        })
      );
  }
  changePassword(data: { newPassword: string }): Observable<any> {
    const userId = parseInt(this.getUsuarioId() || '0', 10); // Convierte a entero o usa 0 como fallback
  
    if (!userId || isNaN(userId)) {
      console.error('Error: userId no es válido');
      return of(null); // Retorna un observable vacío si el ID es inválido
    }
  
    // Enviar datos como objeto en el cuerpo de la solicitud
    return this.http.put(`${this.apiUrl}/Acceso/CambiarContrasena`, {
      userId: userId,
      nuevaContrasena: data.newPassword
    });
  }
  
  requirePasswordChange(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return sessionStorage.getItem('requirePasswordChange') === 'true';
    }
    return false;
  }
}
