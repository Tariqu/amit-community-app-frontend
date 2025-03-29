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
import { FamilyService } from '../../services/family.service';
import { Family } from '../../../../core/models/family';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreateFamilyComponent } from '../create-family/create-family.component';
import { Router } from '@angular/router';

@Component({
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule, // Add paginator module
    MatIconModule,
    MatTooltipModule,
  ],
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrl: './family-list.component.scss',
})
export class FamilyListComponent implements OnChanges {
  @Input() families: Family[] = [];
  @Input() totalCount: number = 0; // New input for total count
  @Output() loadFamilies = new EventEmitter<{ page: number; limit: number }>(); // Update event to include pagination params
  private familyService = inject(FamilyService);
  private dialog = inject(MatDialog);
  private router: Router = inject(Router);

  dataSource = new MatTableDataSource<Family>([]);
  displayedColumns: string[] = ['familyPhoto', 'familyName', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Reference to paginator

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['families']) {
      this.dataSource.data = this.families;
    }
  }

  onPageChange(event: PageEvent): void {
    this.loadFamilies.emit({
      page: event.pageIndex + 1,
      limit: event.pageSize,
    });
  }

  onEdit(family: Family) {
    this.router.navigate(['/edit-families', family.id]);
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this family?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Deleting family with ID:', id);
        this.familyService.deleteFamily(id).subscribe({
          next: () =>
            this.loadFamilies.emit({
              page: this.paginator.pageIndex + 1,
              limit: this.paginator.pageSize,
            }),
          error: (err) => console.error('Delete failed:', err),
        });
      }
    });
  }
}
