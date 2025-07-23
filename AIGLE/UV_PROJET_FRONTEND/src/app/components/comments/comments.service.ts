import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private API = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}

  getComments(projectId: number) {
    return this.http.get(`${this.API}/comments/project/${projectId}`);
  }
  postComment(projectId: number, content: string) {
    return this.http.post(`${this.API}/comments`, { project_id: projectId, content });
  }
  replyToComment(parentId: number, content: string, projectId?: number) {
    // projectId est requis par le backend
    return this.http.post(`${this.API}/comments/${parentId}/reply`, { project_id: projectId, content });
  }
  updateComment(commentId: number, content: string) {
    return this.http.put(`${this.API}/comments/${commentId}`, { content });
  }
  deleteComment(commentId: number) {
    return this.http.delete(`${this.API}/comments/${commentId}`);
  }
}
