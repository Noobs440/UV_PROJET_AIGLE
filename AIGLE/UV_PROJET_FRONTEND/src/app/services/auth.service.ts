import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';


export interface User {
  id: number;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000';
  private user: User | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  /** 1. Appeler le backend pour init le cookie CSRF */
  initCsrf(): Observable<any> {
    return this.http.get(`${this.API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true
    });
  }

  /** 2. Connexion réelle via Laravel */
  login(username: string, password: string): Observable<any> {
    return this.initCsrf().pipe(
      tap(() => console.log('CSRF ready')),
      switchMap(() =>
        this.http.post(`${this.API_URL}/api/usecases/auth/connexion`, {
  email: username,
  password: password
}, { withCredentials: true })
.pipe(
          tap(() => console.log('Login success')),
          switchMap(() => this.getUserFromApi())
        )
      ),
      catchError(err => {
        console.error('Erreur login', err);
        return of(null);
      })
    );
  }

  /** 3. Récupération sécurisée de l’utilisateur connecté */
  getUserFromApi(): Observable<User | null> {
    return this.http.get<User>(`${this.API_URL}/api/user`, {
      withCredentials: true
    }).pipe(
      tap(user => this.user = user),
      catchError(err => {
        console.error('Erreur get user', err);
        return of(null);
      })
    );
  }

  getUser(): User | null {
    return this.user;
  }

  getRole(): string {
    return this.user?.role || '';
  }

  getUserId(): number | null {
    return this.user?.id || null;
  }

  logout(): void {
    this.http.post(`${this.API_URL}/logout`, {}, {
      withCredentials: true
    }).subscribe(() => {
      this.user = null;
      this.router.navigate(['/']);
    });
  }
}
