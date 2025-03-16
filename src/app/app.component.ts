import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);

  // Method to check if header should be shown
  shouldShowHeader(): boolean {
    const url = this.router.url;
    return (
      !url.startsWith('/login') &&
      !url.startsWith('/fill-details/') &&
      !url.startsWith('/error') &&
      !url.startsWith('/success')
    );
  }
}
