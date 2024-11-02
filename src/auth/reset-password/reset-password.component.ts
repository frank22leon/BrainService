import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  constructor(private authService: AuthService) {
  }
  logout() {
    this.authService.logout();
  }
}
