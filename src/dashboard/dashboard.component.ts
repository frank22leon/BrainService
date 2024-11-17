import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../service/auth.service';
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
  isCollapsed = false;
  notifications: Array<{ id: number; text: string }> = [];
  showNotifications = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario(); // Obtenemos el nombre de usuario al inicializar el componente
    this.loadNotifications();
  }

  loadNotifications(): void {
    // Simulación de carga de notificaciones desde un arreglo
    this.notifications = [
      { id: 1, text: 'Tienes una nueva tarea asignada' },
      { id: 2, text: 'Revisión de ticket pendiente' },
      { id: 3, text: 'Alerta de seguridad' },
    ];
  }

  removeNotification(id: number): void {
    console.log(`Eliminando notificación con ID: ${id}`);
    this.notifications = this.notifications.filter(
      (notification) => notification.id !== id
    );
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
