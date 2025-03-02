import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { UserService } from '../../services/user.service';
import { User } from '../../../../core/models/user';
import { UserFormComponent } from '../user-form/user-form.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule, // Add paginator module
    MatIconModule,
    MatTooltipModule,
  ],
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnChanges {
  @Input() users: User[] = [];
  @Input() totalCount: number = 0; // New input for total count
  @Output() loadUsers = new EventEmitter<{ page: number; limit: number }>(); // Update event to include pagination params
  private userService = inject(UserService);
  private dialog = inject(MatDialog);

  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'city',
    'state',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to paginator

  ngOnChanges(changes: SimpleChanges) {
    if (changes['users'] && this.users) {
      this.dataSource.data = this.users;
    }
    if (changes['totalCount'] && this.paginator) {
      this.paginator.length = this.totalCount; // Update total items for paginator
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Bind paginator to data source
    this.paginator.page.subscribe((event) => {
      // Emit page change event with 1-based page index
      this.loadUsers.emit({
        page: event.pageIndex + 1,
        limit: event.pageSize,
      });
    });
  }

  onEdit(user: User) {
    console.log('Edit user:', user);
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers.emit({
          page: this.paginator.pageIndex + 1,
          limit: this.paginator.pageSize,
        });
      }
    });
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this user?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: () =>
            this.loadUsers.emit({
              page: this.paginator.pageIndex + 1,
              limit: this.paginator.pageSize,
            }),
          error: (err) => console.error('Delete failed:', err),
        });
      }
    });
  }

  onPageChange(page: PageEvent) {
    this.loadUsers.emit({
      page: page.pageIndex + 1,
      limit: page.pageSize,
    });
  }
}
