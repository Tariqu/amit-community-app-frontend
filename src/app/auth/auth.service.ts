import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('token')
  );
  token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Observable<any> {
    console.log(username, password, environment.baseUrl);
    return this.http
      .post(`${environment.baseUrl}/api/v1/auth/login`, { username, password })
      .pipe(
        tap((response: any) => {
          const token = response.token;
          localStorage.setItem('token', token);
          this.tokenSubject.next(token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
  }

  logoutAndRedirect() {
    this.logout();
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.tokenSubject.value;
  }

  // Public getter for the token
  getToken(): string | null {
    return this.tokenSubject.value;
  }
}
