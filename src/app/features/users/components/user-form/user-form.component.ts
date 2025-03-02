import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserService } from '../../services/user.service';
import { User } from '../../../../core/models/user';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  public dialogRef = inject(MatDialogRef<UserFormComponent>);

  userForm: FormGroup;
  isEdit = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User | null }) {
    console.log('UserFormComponent data:', this.data);
    this.isEdit = !!this.data?.user;
    const user = this.data?.user || null;
    // Format dob to YYYY-MM-DD for <input type="date">
    const dobFormatted = user?.dob
      ? new Date(user.dob).toISOString().split('T')[0]
      : '';
    // Adjust form initialization
    this.userForm = this.fb.group({
      firstName: [this.data?.user?.firstName || '', Validators.required],
      lastName: [this.data?.user?.lastName || '', Validators.required],
      email: [
        this.data?.user?.email || '',
        [Validators.required, Validators.email],
      ],
      phone: [this.data?.user?.phone || '', Validators.required],
      fathersName: [this.data?.user?.fathersName || ''],
      mothersName: [this.data?.user?.mothersName || ''],
      origin: [this.data?.user?.origin || ''],
      gotr: [this.data?.user?.gotr || ''],
      occupation: [this.data?.user?.occupation || ''],
      occupationDetail: [this.data?.user?.occupationDetail || ''],
      dob: [dobFormatted || '', Validators.required],
      area: [this.data?.user?.area || ''],
      city: [this.data?.user?.city || ''],
      state: [this.data?.user?.state || ''],
      pinCode: [this.data?.user?.pinCode || ''],
      otherDescription: [this.data?.user?.otherDescription || ''],
      password: ['', this.isEdit ? [] : [Validators.required]],
    });
  }

  ngOnInit() {
    console.log(this.isEdit, this.data?.user);
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;
    if (this.isEdit && this.data?.user) {
      this.userService.updateUser(this.data.user.id!, userData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Update failed:', err),
      });
    } else {
      this.userService.addUser(userData).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Add failed:', err),
      });
    }
  }
}
