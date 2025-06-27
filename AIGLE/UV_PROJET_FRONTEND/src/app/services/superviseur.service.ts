import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperviseurService {

  constructor(private http:HttpClient){}


  geSuperviseurs(): Observable<any[]>{
    return this.http.get<any[]>('http://localhost:8000/api/ressources/superviseurs').pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }

  addSuperviseur(nom_sup:string , email_sup:string):Observable<any>{
    return this.http.post<any>('http://localhost:8000/api/ressources/superviseurs', {nom_sup , email_sup});
  }

  deleteSuperviseur(id:string):Observable<any>{
    return this.http.delete(`http://localhost:8000/api/ressources/superviseurs/${id}`);
  }

  updateSuperviseur(id:string ,nom_sup:string , email_sup:string):Observable<any>{
    return this.http.put<any>(`http://localhost:8000/api/ressources/superviseurs/${id}`, {nom_sup , email_sup});
  }
}
