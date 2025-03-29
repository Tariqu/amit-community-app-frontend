import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FamilyListComponent } from './components/family-list/family-list.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { FamilyService } from './services/family.service';
import { LinkDialogComponent } from '../../shared/components/link-dialog/link-dialog.component';
import { Family } from '../../core/models/family';

@Component({
  selector: 'app-families',
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    FamilyListComponent,
    MatNativeDateModule,
    SearchFilterComponent,
    MatIconModule,
  ],
  templateUrl: './families.component.html',
  styleUrl: './families.component.scss',
})
export class FamiliesComponent {
  private familyService = inject(FamilyService);
  private dialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private router: Router = inject(Router);

  families: Family[] = [];
  filteredFamilies: Family[] = [];
  totalCount: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;

  ngOnInit() {
    this.loadFamilies(this.currentPage, this.pageSize);
  }

  loadFamilies(page: number, limit: number) {
    this.currentPage = page;
    this.pageSize = limit;
    this.familyService.getFamilies(page, limit).subscribe({
      next: (response) => {
        this.families = response.data.rows;
        this.filteredFamilies = response.data.rows;
        this.totalCount = response.data.count;
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.families = [];
        this.filteredFamilies = [];
        this.totalCount = 0;
      },
    });
  }

  onAddFamilies() {
    this.router.navigate(['/create-families']);
  }

  onSearchFilterChange(filteredFamilies: Family[]) {
    this.filteredFamilies = filteredFamilies || [];
  }

  onPageChange(event: { page: number; limit: number }) {
    this.loadFamilies(event.page, event.limit);
  }

  onGenerateLink() {
    this.familyService.generateLink().subscribe({
      next: (response) => {
        const link = response.data.link;
        this.dialog.open(LinkDialogComponent, {
          width: '400px',
          data: { link },
        });
      },
      error: (err) => {
        console.error('Failed to generate link:', err);
        this.snackBar.open('Failed to generate link', 'Close', {
          duration: 5000,
        });
      },
    });
  }
}
