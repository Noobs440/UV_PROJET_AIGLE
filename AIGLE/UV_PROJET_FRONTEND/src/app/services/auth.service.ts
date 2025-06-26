import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://votre-api.com/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.verifyRedirection();
      }
    });
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/usecases/auth/connexion`, { email, password }).pipe(
      tap(response => {
        this.storeAuthData(response);
        this.redirectUser(response);
      }),
      map(() => true),
      catchError(error => {
        console.error('Erreur de connexion:', error);
        return of(false);
      })
    );
  }

  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('user_role', response.role);
    localStorage.setItem('user_id', response.id);
    if (response.redirect_to) {
      localStorage.setItem('redirect_to', response.redirect_to);
    }
  }

  private redirectUser(response: AuthResponse): void {
    const targetUrl = response.redirect_to || this.getTargetUrl(response.role);
    console.log('Redirection vers :', targetUrl);

    setTimeout(() => {
      this.router.navigateByUrl(targetUrl, { replaceUrl: true }).then(success => {
        if (!success) {
          console.warn('Navigation Angular échouée, tentative via window.location.href');
          window.location.href = targetUrl;
        }
      }).catch(err => {
        console.error('Erreur de navigation Angular:', err);
        window.location.assign(targetUrl);
      });
    }, 200);
  }

  private getTargetUrl(role: string): string {
    const routes: Record<string, string> = {
      'admin': '/admin/dashboard',
      'superviseur': '/enseignant/dashboard',
      'user': '/dashboard'
    };
    return routes[role] || '/home';
  }

  private verifyRedirection(): void {
    const role = localStorage.getItem('user_role');
    const currentUrl = this.router.url;

    if (role === 'superviseur' && !currentUrl.startsWith('/enseignant')) {
      console.warn('Redirection automatique superviseur vers /enseignant/dashboard');
      this.router.navigate(['/enseignant/dashboard'], {
        replaceUrl: true
      });
    }

    if (role === 'admin' && !currentUrl.startsWith('/admin')) {
      console.warn('Redirection automatique admin vers /admin/dashboard');
      this.router.navigate(['/admin/dashboard'], {
        replaceUrl: true
      });
    }
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/home';
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

interface AuthResponse {
  access_token: string;
  role: string;
  id: string;
  redirect_to?: string;
}
