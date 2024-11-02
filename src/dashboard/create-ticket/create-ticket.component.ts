import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [],
  templateUrl: './create-ticket.component.html',
  styleUrl: './create-ticket.component.css'
})
export class CreateTicketComponent {
  constructor(private authService: AuthService) { }

  logout(): void {
    this.authService.logout();
  }
}
