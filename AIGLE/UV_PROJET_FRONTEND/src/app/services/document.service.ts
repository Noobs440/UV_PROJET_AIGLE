import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError, of } from 'rxjs';

export interface Document {
  id?: number;
  nom_doc: string;
  lien_doc?: string;
  type_doc?: string;
  resume?: string;
  tbl_projet_id: number | string;
  user_id: number | string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private baseUrl = 'http://localhost:8000/api/ressources/documents';

  constructor(private http: HttpClient) {}

  getDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(this.baseUrl).pipe(
      tap(response => console.table(response)),
      catchError(this.handleError<Document[]>('getDocuments', []))
    );
  }

  addDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(this.baseUrl, formData).pipe(
      tap(response => console.log('Document ajouté:', response)),
      catchError(this.handleError<Document>('addDocument'))
    );
  }

  deleteDocument(id: string | number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Document supprimé id=${id}`)),
      catchError(this.handleError<void>('deleteDocument'))
    );
  }

  updateDocument(
    id: string | number,
    nom_doc: string,
    lien_doc: string,
    type_doc: string,
    resume: string,
    tbl_projet_id: string | number,
    user_id: string | number
  ): Observable<Document> {
    const url = `${this.baseUrl}/${id}`;
    const body = { nom_doc, lien_doc, type_doc, resume, tbl_projet_id, user_id };
    return this.http.put<Document>(url, body).pipe(
      tap(response => console.log('Document mis à jour:', response)),
      catchError(this.handleError<Document>('updateDocument'))
    );
  }

  getDocumentsByProject(id: number | string): Observable<Document[]> {
    const url = `http://localhost:8000/api/usecases/listing/projet/documents/${id}`;
    return this.http.get<Document[]>(url).pipe(
      tap(response => console.table(response)),
      catchError(this.handleError<Document[]>('getDocumentsByProject', []))
    );
  }

  // Gestion générique des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // On peut envoyer l'erreur à un service distant de logging ici
      return of(result as T);  // Retourne une valeur par défaut pour que l'app continue
    };
  }
}
