import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyService } from '../../services/family.service';
import { Family } from '../../../../core/models/family';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { UserService } from '../../../users/services/user.service';
import { SignedUrlAPIResponse } from '../../../../core/models/signedUrl';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../../core/models/user';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { UserFormComponent } from '../../../users/components/user-form/user-form.component';

@Component({
  standalone: true,
  selector: 'app-create-family',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './create-family.component.html',
  styleUrls: ['./create-family.component.scss'],
})
export class CreateFamilyComponent implements OnInit {
  familyForm!: FormGroup;
  familyId: number | null = null;
  familyMembers: User[] = []; // Replace with a proper model if available
  isEditMode: boolean = false;
  profilePicturePreview: string | null = null; // For image preview
  selectedFile: File | null = null; // Store selected file
  isEdit: boolean = false; // Flag to check if in edit mode
  family: Family | null = null; // For storing family data
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'role',
    'actions',
  ];
  private dialog = inject(MatDialog);

  constructor(
    private fb: FormBuilder,
    private familyService: FamilyService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.familyId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.familyId;

    this.familyForm = this.fb.group({
      familyPhoto: [null],
      familyName: ['', Validators.required],
      description: [''],
    });

    if (this.isEditMode) {
      this.loadFamilyDetails();
    }
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

  loadFamilyDetails(): void {
    if (!this.familyId) return; // Safety check
    this.familyService.getFamilyById(this.familyId!).subscribe({
      next: ({ data }) => {
        this.familyForm.patchValue({
          familyPhoto: data.familyPhoto,
          familyName: data.familyName,
          description: data.description,
        });
        this.profilePicturePreview = data.familyPhoto; // Set initial preview
        // if editing
        this.isEdit = true;
        this.family = data; // Store family data for later use
      },
      error: (err) => console.error('Failed to load family details:', err),
    });
    // Fetch family members and details
    this.getFamilyMembers(this.familyId);
  }

  // Fetch family members and details
  getFamilyMembers(familyId: number): void {
    this.familyService.getFamilyMembers(familyId).subscribe({
      next: ({ data }) => {
        console.log('Family members:', data);
        this.familyMembers = data;
      },
      error: (err) => console.error('Failed to load family members:', err),
    });
  }

  // Upload image using signed URL
  private uploadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.selectedFile) {
        resolve(this.familyForm.get('familyPhoto')?.value || ''); // Use existing URL if no new file
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
    if (this.familyForm.invalid) {
      return;
    }

    this.uploadImage()
      .then((imageUrl) => {
        const userData = { ...this.familyForm.value, familyPhoto: imageUrl };

        if (this.isEdit) {
          this.familyService
            .updateFamily(this.family!.id!, userData)
            .subscribe({
              next: () => {},
              error: (err) => console.error('Update failed:', err),
            });
        } else {
          this.familyService.addFamily(userData).subscribe({
            next: (value) => {
              console.log('Family added:', value);
              this.router.navigate(['/edit-families', value.data.id]); // Redirect after adding
            },
            error: (err) => console.error('Add failed:', err),
          });
        }
      })
      .catch((err) => {
        console.error('Image upload failed:', err);
        // Optionally show an error message to the user
      });
  }

  onAddUser() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: { user: null, familyId: this.familyId! }, // Null for new user
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getFamilyMembers(this.familyId!); // Refresh family members after adding
      }
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
        this.getFamilyMembers(this.familyId!); // Refresh family members after edit
      }
    });
  }

  onDeleteFamilyMember(memberId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this user?' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.userService.deleteUser(memberId).subscribe({
          next: () => {
            this.familyMembers = this.familyMembers.filter(
              (member) => member.id !== memberId
            );
            console.log('Family member deleted:', memberId);
          },
          error: (err) => console.error('Delete failed:', err),
        });
      }
    });
  }
}
