import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { NotificationService } from '../service/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  usuario: string | null = null;
  userRole: string | null = null;
  isCollapsed = false;
  notifications: Array<{ id: number; text: string }> = [];
  showNotifications = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.userRole = this.authService.getUserRole();
    console.log(this.usuario); // Obtenemos el nombre de usuario al inicializar el componente
    this.loadNotifications();
  }

  loadNotifications(): void {
    const userId = this.authService.getUsuarioId();
    if (!userId) {
      console.error('No se pudo cargar el ID del usuario.');
      return;
    }

    this.notificationService.getNotifications(Number(userId)).subscribe({
      next: (data) => {
        this.notifications = data.map((notification: any) => ({
          id: notification.notificationId,
          text: notification.message,
        }));
      },
      error: (err) => {
        console.error('Error al cargar notificaciones:', err);
      },
    });
  }

  removeNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        console.log(`Notificación con ID ${id} eliminada de la base de datos.`);
        this.notifications = this.notifications.filter(notification => notification.id !== id);
      },
      error: (err) => {
        console.error(`Error al eliminar la notificación con ID ${id}:`, err);
      },
    });
  }
  

  toggleNotifications(event: Event): void {
    event.preventDefault(); // Evita que el enlace recargue la página
    this.showNotifications = !this.showNotifications;
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed; // Cambia el estado de colapsado/expandido
  }

  logout(): void {
    this.authService.logout(); // Aquí llamas al servicio para cerrar sesión
  }
}
