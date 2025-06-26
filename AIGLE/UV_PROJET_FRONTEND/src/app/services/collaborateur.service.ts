import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CollaborateurService {

  constructor(private http:HttpClient){}


  geCollaborateurs(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:8000/api/ressources/collaborateurs').pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }

  addCollaborateur(nom_collab:string , email_collab:string, tbl_projet_id:string, user_id:string):Observable<any>{
    return this.http.post<any>('http://localhost:8000/api/ressources/collaborateurs', {nom_collab , email_collab, tbl_projet_id, user_id});
  }

  deleteCollaborateur(id:string):Observable<any>{
    return this.http.delete(`http://localhost:8000/api/ressources/collaborateurs/${id}`);
  }

  updateCollaborateur(id:string ,nom_collab:string , email_collab:string, tbl_projet_id:string, user_id:string):Observable<any>{
    return this.http.put<any>(`http://localhost:8000/api/ressources/collaborateurs/${id}`, {nom_collab , email_collab, tbl_projet_id, user_id});
  }
   getCollaboratorsByProject(id:number): Observable<any[]>{
    return this.http.get<any[]>(`http://localhost:8000/api/usecases/listing/projet/collaborateurs/${id}`).pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }
}
