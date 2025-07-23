import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SubmitProjectService {

  constructor(private http:HttpClient) { }

  submitProject(projetId:number): Observable<any> {
    // Récupère le token Sanctum depuis le localStorage ou d'où tu le stockes
    const token = localStorage.getItem('token');
  
    // Headers avec le token Sanctum
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<any>(`http://localhost:8000/api/usecases/submit/${projetId}`, null, { headers });
  }

}
