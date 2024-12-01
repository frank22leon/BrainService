import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(private snackBar: MatSnackBar) {}

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
}

