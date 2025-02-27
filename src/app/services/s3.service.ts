import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthHeadersService } from './auth-headers.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class S3Service {
  private backendUrl = environment.apiUrl;

  constructor(
    private authheaders: AuthHeadersService,
    private http: HttpClient
  ) {}

  getSignedUrl(fileName: string, fileType: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/get-signed-url`, {
      params: { fileName, fileType },
      headers: this.authheaders.getAuthHeaders(),
    });
  }

  updateProfile(profileImageUrl: string): Observable<any> {
    return this.http.post(
      `${this.backendUrl}/update-profile`,
      { profileImageUrl },
      { headers: this.authheaders.getAuthHeaders() }
    );
  }
}
