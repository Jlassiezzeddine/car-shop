import { Component, inject } from '@angular/core';
import { DarkModeService } from '@shared/services/darkmode/darkmode';
import { ZardButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-hero',
  imports: [ZardButtonComponent],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private readonly darkmodeService = inject(DarkModeService);

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }
}
