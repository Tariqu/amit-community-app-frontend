import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  selector: 'app-link-dialog',
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.scss'],
})
export class LinkDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LinkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { link: string },
    private snackBar: MatSnackBar
  ) {}

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.data.link).then(
      () => {
        this.snackBar.open('Link copied to clipboard!', 'Close', {
          duration: 5000,
        });
      },
      (err) => {
        console.error('Failed to copy text: ', err);
        this.snackBar.open('Failed to copy link', 'Close', {
          duration: 5000,
        });
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
