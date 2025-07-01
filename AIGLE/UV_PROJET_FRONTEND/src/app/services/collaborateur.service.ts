import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Collaborateur {
  id?: number;
  nom_collab: string;
  email_collab: string;
}

@Injectable({
  providedIn: 'root'
})
export class CollaborateurService {

  private apiUrl = 'http://localhost:8000/api/ressources/collaborateurs';

  constructor(private http: HttpClient) {}

  getCollaborateurs(): Observable<Collaborateur[]> {
    return this.http.get<Collaborateur[]>(this.apiUrl).pipe(
      tap(response => console.table(response)),
      catchError(error => {
        console.error('Erreur lors de la récupération des collaborateurs:', error);
        return of([]);
      })
    );
  }

  addCollaborateur(nom_collab: string, email_collab: string): Observable<Collaborateur> {
    return this.http.post<Collaborateur>(this.apiUrl, { nom_collab, email_collab });
  }

  deleteCollaborateur(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCollaborateur(id: number | string, nom_collab: string, email_collab: string): Observable<Collaborateur> {
    return this.http.put<Collaborateur>(`${this.apiUrl}/${id}`, { nom_collab, email_collab });
  }

  // ✅ Nouvelle méthode pour ajouter un collaborateur à un projet et envoyer un email
  addCollaborateurToProject(projectId: number, data: { nom: string; email: string }): Observable<any> {
    const url = `http://localhost:8000/api/collaborateurs/add-to-project/${projectId}`;
    return this.http.post<any>(url, data).pipe(
      tap(response => console.log('Collaborateur ajouté au projet avec succès:', response)),
      catchError(error => {
        console.error('Erreur lors de l’ajout du collaborateur au projet:', error);
        return of(error);
      })
    );
  }
}
