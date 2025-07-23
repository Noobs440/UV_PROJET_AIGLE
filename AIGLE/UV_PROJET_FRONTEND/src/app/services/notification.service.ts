import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = 'http://localhost:8000/api/auth'; // Vérifie si ton backend utilise bien ce préfixe "auth"

  constructor(private http: HttpClient) {}

  /** 🔐 Utilitaire : récupère les headers avec le token JWT */
  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token ?? ''}`,
        'Accept': 'application/json'
      })
    };
  }

  /** 🔔 Récupère toutes les notifications de l'utilisateur */
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notifications`, this.getAuthHeaders())
      .pipe(
        catchError((error) => {
          console.error('Erreur lors de la récupération des notifications', error);
          return of([]);
        })
      );
  }

  /** ✅ Marque une notification comme lue */
  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/notifications/read/${notificationId}`,
      {},
      this.getAuthHeaders()
    );
  }

  /** ✅ Marque toutes les notifications comme lues */
  markAllNotificationAsRead(): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/notifications/readAll`,
      {},
      this.getAuthHeaders()
    );
  }

  /** 🚀 Envoie une notification à tous les collaborateurs et au créateur du projet */
  sendProjectNotification(payload: { projectId: any, collaboratorEmail: string, message: string }): Observable<any> {
    // À adapter selon l'API backend réelle
    return this.http.post<any>(
      `${this.baseUrl}/notifications/project`,
      payload,
      this.getAuthHeaders()
    );
  }

  /** (Optionnel) Envoie un email à tous les collaborateurs et au créateur du projet */
  sendProjectEmail(payload: { projectId: any, collaboratorEmail: string, message: string }): Observable<any> {
    // À adapter selon l'API backend réelle
    return this.http.post<any>(
      `${this.baseUrl}/notifications/project/email`,
      payload,
      this.getAuthHeaders()
    );
  }
}
