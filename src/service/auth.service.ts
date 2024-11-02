import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7159/api';

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Acceso/Login`, data)
      .pipe(
        tap(response => {
          if (response.isSuccess) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', response.token);  // Guarda el token
            }
          }
        }),
        catchError(error => {
          console.error(error);
          return of(null);  // Devuelve un observable vacío en caso de error
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }
  

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token'); 
      return !!token;
    }
    return false; // Retorna false si no está en el navegador
  }
}
