import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SignedUrlAPIResponse } from '../../../../core/models/signedUrl';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { CustomDateAdapter } from '../../../../shared/custom/custom-date-adapter';
import { CUSTOM_DATE_FORMATS } from '../../../../shared/custom/custom-date-format';

@Component({
  selector: 'app-fill-details',
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
  templateUrl: './fill-details.component.html',
  styleUrls: ['./fill-details.component.scss'],
})
export class FillDetailsComponent implements OnInit {
  userForm: FormGroup;
  token: string = '';
  profilePicturePreview: string | null = null; // For image preview
  selectedFile: File | null = null; // Store selected file
  tokenValid: boolean = false; // To track token validity

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private http: HttpClient
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      fathersName: [''],
      mothersName: [''],
      origin: [''],
      gotr: [''],
      occupation: [''],
      occupationDetail: [''],
      dob: ['', Validators.required],
      area: [''],
      city: [''],
      state: [''],
      pinCode: [''],
      otherDescription: [''],
      profilePicture: [''],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.validateToken();
  }

  validateToken(): void {
    this.userService.validateToken(this.token).subscribe({
      next: (response) => {
        if (response.data.valid) {
          this.tokenValid = true;
        } else {
          this.router.navigate(['/error'], {
            queryParams: { message: 'Invalid or expired token' },
          });
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Token validation failed:', err);
        this.router.navigate(['/error'], {
          queryParams: { message: err.error.message },
        });
      },
    });
  }

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

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.uploadImage()
      .then((imageUrl) => {
        const userData = { ...this.userForm.value, profilePicture: imageUrl };
        if (userData.dob) {
          userData.dob = new Date(userData.dob).toISOString();
        }

        this.userService.submitDetails(this.token, userData).subscribe({
          next: () => this.router.navigate(['/success']),
          error: (err) => console.error('Submission failed:', err),
        });
      })
      .catch((err) => {
        console.error('Image upload failed:', err);
        // Optionally show an error message to the user
      });
  }
}
