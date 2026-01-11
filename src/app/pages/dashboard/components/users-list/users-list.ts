import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '@shared/services/user/user.service';
import { IUser } from '@shared/interfaces/user.interface';
import { IApiPaginationParams } from '@shared/interfaces/api-list-response.interface';
import { ZardButtonComponent } from '@shared/components/ui/button/button.component';
import { ZardIconComponent } from '@shared/components/ui/icon/icon.component';
import { UserForm } from '../user-form/user-form';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule, ZardButtonComponent, ZardIconComponent, UserForm],
  templateUrl: './users-list.html',
})
export class UsersList implements OnInit {
  private userService = inject(UserService);

  users = signal<IUser[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  showForm = signal(false);
  editingUser = signal<IUser | null>(null);
  currentPage = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);
  total = signal(0);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    const params: IApiPaginationParams = {
      page: this.currentPage(),
      limit: this.pageSize(),
    };

    this.userService.getUsers(params).subscribe({
      next: (response) => {
        this.users.set(response.data.data);
        this.total.set(response.data.meta.total);
        this.totalPages.set(response.data.meta.totalPages);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to load users');
        this.loading.set(false);
      },
    });
  }

  openAddForm(): void {
    this.editingUser.set(null);
    this.showForm.set(true);
  }

  openEditForm(user: IUser): void {
    this.editingUser.set(user);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.editingUser.set(null);
  }

  onUserSaved(): void {
    this.closeForm();
    this.loadUsers();
  }

  deleteUser(id: string): void {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    this.loading.set(true);
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to delete user');
        this.loading.set(false);
      },
    });
  }

  restoreUser(id: string): void {
    this.loading.set(true);
    this.userService.restoreUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to restore user');
        this.loading.set(false);
      },
    });
  }

  deleteUserPermanent(id: string): void {
    if (
      !confirm(
        'Are you sure you want to permanently delete this user? This action cannot be undone.',
      )
    ) {
      return;
    }
    this.loading.set(true);
    this.userService.deleteUserPermanent(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to permanently delete user');
        this.loading.set(false);
      },
    });
  }

  revokeAccess(id: string): void {
    if (!confirm('Are you sure you want to revoke access for this user?')) {
      return;
    }
    this.loading.set(true);
    this.userService.revokeAccess(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to revoke access');
        this.loading.set(false);
      },
    });
  }

  blacklistUser(id: string): void {
    if (!confirm('Are you sure you want to blacklist this user?')) {
      return;
    }
    this.loading.set(true);
    this.userService.blacklistUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => {
        this.error.set(err?.error?.message || 'Failed to blacklist user');
        this.loading.set(false);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadUsers();
    }
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }
}
