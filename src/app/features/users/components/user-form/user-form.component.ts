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
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { SignedUrlAPIResponse } from '../../../../core/models/signedUrl';
import { CustomDateAdapter } from '../../../../shared/custom/custom-date-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../../shared/custom/custom-date-format';

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
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Ensure locale is set for DD/MM/YYYY
  ],
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private http = inject(HttpClient);
  public dialogRef = inject(MatDialogRef<UserFormComponent>);

  userForm: FormGroup;
  isEdit = false;
  profilePicturePreview: string | null = null; // For image preview
  selectedFile: File | null = null; // Store selected file

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User | null }) {
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
      profilePicture: [user?.profilePicture || ''],
    });

    // Set initial preview if editing
    if (this.isEdit && user?.profilePicture) {
      this.profilePicturePreview = user.profilePicture;
    }
  }

  ngOnInit() {}

  // Handle file selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profilePicturePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Upload image using signed URL
  private uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.userForm.get('profilePicture')?.value || ''); // Use existing URL if no new file
        return;
      }

      // Fetch signed URL from backend
      this.userService
        .getSignedUrl(this.selectedFile.name, this.selectedFile.type)
        .subscribe({
          next: (response: SignedUrlAPIResponse) => {
            const signedUrl = response.data.signedUrl;
            const publicUrl = response.data.publicUrl;

            // Upload file to signed URL
            this.http
              .put(signedUrl, this.selectedFile, {
                headers: {
                  'Content-Type':
                    this.selectedFile?.type || 'application/octet-stream',
                },
              })
              .subscribe({
                next: () => resolve(publicUrl), // Return public URL after upload
                error: (err) => reject(err),
              });
          },
          error: (err: any) => reject(err),
        });
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      return;
    }

    this.uploadImage()
      .then((imageUrl) => {
        const userData = {
          ...this.userForm.value,
          profilePicture: imageUrl,
          familyId: this.data.user?.familyId || null,
        };
        if (userData.dob) {
          userData.dob = new Date(userData.dob).toISOString();
        }

        if (this.isEdit) {
          this.userService.updateUser(this.data.user!.id!, userData).subscribe({
            next: () => this.dialogRef.close(true),
            error: (err) => console.error('Update failed:', err),
          });
        } else {
          this.userService.addUser(userData).subscribe({
            next: () => this.dialogRef.close(true),
            error: (err) => console.error('Add failed:', err),
          });
        }
      })
      .catch((err) => {
        console.error('Image upload failed:', err);
        // Optionally show an error message to the user
      });
  }
}
