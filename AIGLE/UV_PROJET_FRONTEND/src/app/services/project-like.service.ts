import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectLikeService {
  private API = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}

  toggleLike(projectId: number): Observable<any> {
    return this.http.post(`${this.API}/likes/projects/${projectId}/toggle-like`, {});
  }

  getLikes(projectId: number): Observable<{ liked: boolean, likes: number }> {
    return this.http.get<{ liked: boolean, likes: number }>(`${this.API}/likes/projects/${projectId}`);
  }
}
