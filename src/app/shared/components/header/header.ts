import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Breadcrumb, BreadcrumbService } from '../../services/breadcrumb/breadcrumb';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
})
export class Header implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  private breadcrumbService = inject(BreadcrumbService);

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((crumbs) => {
      this.breadcrumbs = crumbs;
    });
  }
}
