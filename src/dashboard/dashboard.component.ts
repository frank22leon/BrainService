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
  

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario(); // Obtenemos el nombre de usuario al inicializar el componente
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed; // Cambia el estado de colapsado/expandido
  }

  logout(): void {
    this.authService.logout(); // Aquí llamas al servicio para cerrar sesión
  }
}
