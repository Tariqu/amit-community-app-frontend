import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Family } from '../../../core/models/family';
import { User } from '../../../core/models/user';

interface ApiResponse {
  status: string;
  data: {
    count: number;
    rows: Family[];
  };
}
@Injectable({ providedIn: 'root' })
export class FamilyPubService {
  private apiUrl = `${environment.baseUrl}/api/v1/pub-families`;

  constructor(private http: HttpClient) {}

  getFamilies(page: number = 1, limit: number = 10): Observable<ApiResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ApiResponse>(this.apiUrl, { params });
  }

  getFamilyById(token: string): Observable<{ status: string; data: Family }> {
    return this.http.get<{ status: string; data: Family }>(
      `${this.apiUrl}/${token}`
    );
  }

  getFamilyMembers(
    token: string
  ): Observable<{ status: string; data: User[] }> {
    return this.http.get<{ status: string; data: User[] }>(
      `${this.apiUrl}/${token}/members`
    ); // Assuming this endpoint exists
  }

  addFamily(family: Family): Observable<{ status: string; data: Family }> {
    // Assuming the API returns the created family object
    return this.http.post<{ status: string; data: Family }>(
      this.apiUrl,
      family
    );
  }

  updateFamily(id: number, family: Partial<Family>): Observable<Family> {
    return this.http.patch<Family>(`${this.apiUrl}/${id}`, family);
  }

  deleteFamily(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  submitDetails(token: string, userData: any) {
    return this.http.post(
      `${this.apiUrl}/submit-family-details/${token}`,
      userData
    );
  }

  validateToken(token: string) {
    return this.http.get<{
      status: string;
      data: { valid: boolean; message: string; adminId: number };
    }>(`${this.apiUrl}/validate-token/${token}`);
  }
}
