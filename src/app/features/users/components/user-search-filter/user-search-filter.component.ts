import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../../core/models/user';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  selector: 'app-user-search-filter',
  templateUrl: './user-search-filter.component.html',
  styleUrls: ['./user-search-filter.component.scss'],
})
export class UserSearchFilterComponent {
  @Input() users: User[] = [];
  @Output() filterChange = new EventEmitter<User[]>();
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
      this.filterChange.emit(this.users);
      return;
    }

    const filtered = this.users.filter((user) =>
      Object.values(user)
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    this.filterChange.emit(filtered);
  }
}
