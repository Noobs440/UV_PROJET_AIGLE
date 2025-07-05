import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  constructor(private http:HttpClient){}


  getDocuments(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:8000/api/ressources/documents').pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }

  addDocument(formData: FormData): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/ressources/documents', formData);
  }

  deleteDocument(id:string):Observable<any>{
    return this.http.delete(`http://localhost:8000/api/ressources/documents/${id}`);
  }
  deleteDocumentByid(id:string):Observable<any>{
    return this.http.delete(`http://localhost:8000/api/ressources/documents/${id}`);
  }

  updateDocument(id:string ,nom_doc:string , lien_doc:string , type_doc:string, resume:string, tbl_projet_id:string, user_id:string):Observable<any>{
    return this.http.put<any>(`http://localhost:8000/api/ressources/documents/${id}`, {nom_doc , lien_doc , type_doc, resume, tbl_projet_id, user_id});
  }

  getDocumentsByProject(id:number): Observable<any[]>{
    return this.http.get<any[]>(`http://localhost:8000/api/usecases/listing/projet/documents/${id}`).pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }
}
