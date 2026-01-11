import { Component, inject } from '@angular/core';
import { AuthService } from '@authentication/auth.service';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';

@Component({
  selector: 'app-logout-button',
  imports: [ZardButtonComponent],
  templateUrl: './logout-button.html',
})
export class LogoutButton {
  private readonly authService = inject(AuthService);
  onLogout() {
    this.authService.logout();
  }
}
