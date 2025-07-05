import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private readonly API_URL = 'http://localhost:8000';

  constructor(private http:HttpClient) { }

  getProjectsById(id:any): Observable<any[]>{
    return this.http.get<any[]>(`${this.API_URL}/api/usecases/listing/user/projets/${id}`,{ withCredentials: true }).pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }

  getApprovedProjectsById(id:any): Observable<any[]>{
    return this.http.get<any[]>(`http://localhost:8000/api/usecases/listing/user/approved_projets/${id}`).pipe(
      tap((response)=>console.table(response)),
      catchError((error) =>{
        console.log(error);
        return of([]);
      })
    )
  }


}
