import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Breadcrumb, BreadcrumbService } from '../../services/breadcrumb/breadcrumb';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink, DividerModule],
  templateUrl: './page-header.html',
})
export class PageHeader implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs$.subscribe((crumbs) => {
      this.breadcrumbs = crumbs;
    });
  }
}
