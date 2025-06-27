import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {tap, catchError, of, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient , private router:Router) { }

  login(email:string, password:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/usecases/auth/connexion` , {email , password});
  }

  inscription(nom_user:string ,email:string, password:string, tbl_filiere_id:string,matricule:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/usecases/auth/inscription` , {nom_user , email , password,tbl_filiere_id, matricule}, { withCredentials: true });

  }

  verifycode(email:string, code:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/usecases/auth/verify` , {email , code},{ withCredentials: true });

  }

sendVerificationCode(email:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/usecases/password/sendcode` , {email},{ withCredentials: true });

  }
  verifyResetcode(email:string, verification_code:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/usecases/password/verificationcode` , {email , verification_code},{ withCredentials: true });

  }


  resetPassword(email:string, password:string, verification_code:string):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/usecases/password/reset` , {email , password, verification_code},{ withCredentials: true });

  }

  isAuthenticated():boolean{

    const token = localStorage.getItem('token');
    return !!token
  }

  logout():Observable<any>{
     // Récupère le token Sanctum depuis le localStorage ou d'où tu le stockes
      const token = localStorage.getItem('token');
      // Headers avec le token Sanctum
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.post<any>('http://localhost:8000/api/auth/deconnexion', null , {headers});
  }
}


