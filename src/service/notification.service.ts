import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  private apiUrl = 'https://apibrainservice.somee.com/api'; // Cambiar según tu configuración
  constructor(private snackBar: MatSnackBar, private http: HttpClient) {}

  showErrorLogin(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
     /*  verticalPosition: this.verticalPosition, */
      panelClass: ['snack-bar-error']
    });
  }
  showSuccessCreateTicket(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: this.verticalPosition,
      panelClass: ['snack-bar-success']
    });
  }

  showErrorCreateTicket(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: this.verticalPosition,
      panelClass: ['snack-bar-error']
    });
  }
  
  showSuccessCreateUser(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: this.verticalPosition,
      panelClass: ['snack-bar-success']
    });
  }

  showErrorCreateUser(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: this.verticalPosition,
      panelClass: ['snack-bar-error']
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: this.verticalPosition,
      panelClass: ['snack-bar-success']
    });
  }
  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      verticalPosition: this.verticalPosition,
      panelClass: ['snack-bar-error']
    });
  }
  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Notifications/GetNotificationsByUser/${userId}`);
  }
  deleteNotification(notificationId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Notifications/DeleteNotification/${notificationId}`);
  }
}

