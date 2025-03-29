import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Family } from '../../../../core/models/family';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.scss',
})
export class SearchFilterComponent {
  @Input() families: Family[] = [];
  @Output() filterChange = new EventEmitter<Family[]>();
  private fb = inject(FormBuilder);

  searchForm: FormGroup;

  constructor() {
    this.searchForm = this.fb.group({
      search: [''],
    });

    this.searchForm.valueChanges.subscribe((value) => {
      this.applyFilter(value.search);
    });
  }

  applyFilter(searchTerm: string) {
    if (!searchTerm) {
      this.filterChange.emit(this.families);
      return;
    }

    const filtered = this.families.filter((family) =>
      Object.values(family)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    this.filterChange.emit(filtered);
  }
}
