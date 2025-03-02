import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';
import { UserListComponent } from '../components/user-list/user-list.component';
import { UserFormComponent } from '../components/user-form/user-form.component';
import { UserSearchFilterComponent } from '../components/user-search-filter/user-search-filter.component';
import { User } from '../../../core/models/user';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    UserListComponent,
    UserSearchFilterComponent,
  ],
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  users: User[] = [];
  filteredUsers: User[] = [];
  totalCount: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  ngOnInit() {
    this.loadUsers(this.currentPage, this.pageSize);
  }

  loadUsers(page: number, limit: number) {
    this.currentPage = page;
    this.pageSize = limit;
    this.userService.getUsers(page, limit).subscribe({
      next: (response) => {
        this.users = response.data.rows;
        this.filteredUsers = response.data.rows;
        this.totalCount = response.data.count;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.users = [];
        this.filteredUsers = [];
        this.totalCount = 0;
      },
    });
  }

  onAddUser() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user: null }, // Null for new user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers(this.currentPage, this.pageSize); // Refresh list after adding
      }
    });
  }

  onSearchFilterChange(filteredUsers: User[]) {
    this.filteredUsers = filteredUsers || [];
  }

  onPageChange(event: { page: number; limit: number }) {
    this.loadUsers(event.page, event.limit);
  }
}
