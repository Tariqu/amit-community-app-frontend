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
export class UserService {
  private apiUrl = `${environment.baseUrl}/api/v1/users`;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getSignedUrl(key: string, contentType: string) {
    return this.http.get<SignedUrlAPIResponse>(`${this.apiUrl}/signed-url`, {
      params: { key, contentType },
    });
  }

  submitDetails(token: string, userData: any) {
    return this.http.post(`${this.apiUrl}/submit-details/${token}`, userData);
  }

  generateLink() {
    return this.http.get<{ status: string; data: { link: string } }>(
      `${this.apiUrl}/generate-link`
    );
  }

  validateToken(token: string) {
    return this.http.get<{
      status: string;
      data: { valid: boolean; message: string; adminId: number };
    }>(`${this.apiUrl}/validate-token/${token}`);
  }
}
