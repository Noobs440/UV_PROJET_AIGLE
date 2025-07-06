import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8000/api/auth';

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any[]> {
    // Récupère le token Sanctum depuis le localStorage ou d'où tu le stockes
    const token = localStorage.getItem('token');

    // Headers avec le token Sanctum
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any[]>(`${this.baseUrl}/notifications`, { headers });
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
    // Récupère le token Sanctum depuis le localStorage ou d'où tu le stockes
    const token = localStorage.getItem('token');

    // Headers avec le token Sanctum
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Notez que vous devez passer les headers en tant que troisième argument
    return this.http.post<any>(`${this.baseUrl}/notifications/read/${notificationId}`, null, { headers });
}

markAllNotificationAsRead(): Observable<any> {
  // Récupère le token Sanctum depuis le localStorage ou d'où tu le stockes
  const token = localStorage.getItem('token');

  // Headers avec le token Sanctum
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post<any>('http://localhost:8000/api/auth/notifications/readAll', null, { headers });
}

}
