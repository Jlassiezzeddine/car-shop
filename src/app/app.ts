import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DarkModeService } from '@shared/services/darkmode/darkmode';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { Navigation } from './shared/components/navigation/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navigation, Footer, Header],
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('car-shop');
  private readonly darkmodeService = inject(DarkModeService);

  ngOnInit(): void {
    this.darkmodeService.initTheme();
  }
}
