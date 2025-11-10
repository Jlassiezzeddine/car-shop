import { ViewportScroller } from '@angular/common';
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
  private readonly viewportScroller = inject(ViewportScroller);

  getCurrentTheme(): 'light' | 'dark' {
    return this.darkmodeService.getCurrentTheme();
  }

  scrollToElement(elementId: string): void {
    // Set a top offset of 90 pixels
    this.viewportScroller.setOffset([0, 90]);
    this.viewportScroller.scrollToAnchor(elementId);
  }
}
