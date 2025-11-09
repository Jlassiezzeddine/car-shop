import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';
import { PageHeader } from './shared/components/page-header/page-header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, PageHeader],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('car-shop');
}
