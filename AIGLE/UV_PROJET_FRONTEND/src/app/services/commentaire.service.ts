import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class CommentaireService {

  constructor(private http:HttpClient) { }

  addComment(projetID: number, texte: string, date:string ):Observable<any>{
    return this.http.post/*<any>*/('http://localhost:8000/api/ressources/commentcontroller', {projetID, texte, date}); 
  }

  getAllcommentsByprojects(id:number):Observable<any>{
    return this.http.get(`http://localhost:8000/api/ressources/commentcontroller/${id}`).pipe(
        tap((response)=>console.table(response)),
        catchError((error) =>{
          console.log(error);
              return of([]);
        })
      );
  }
}
