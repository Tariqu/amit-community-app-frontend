import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/user';
import { SignedUrlAPIResponse } from '../../../core/models/signedUrl';

interface ApiResponse {
  status: string;
  data: {
    count: number;
    rows: User[];
  };
}
@Injectable({ providedIn: 'root' })
export class UserPubService {
  private apiUrl = `${environment.baseUrl}/api/v1/pub-users`;

  constructor(private http: HttpClient) {}

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
