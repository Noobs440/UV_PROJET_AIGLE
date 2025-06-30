import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userRole: string = ''
  constructor(private router: Router){ }

  login(username: string, password: string): boolean {
    // Mock login logic
    if (username === 'admin' && password === 'ADMINadmin123') {
      this.userRole = 'admin';
      //this.router.navigate(['/admin/dashboard']);
      return true;
    } else if (username === 'user' && password === 'User123user') {
      this.userRole = 'user';
     // this.router.navigate(['/user/dashboard']);
      return true;
    }
    return false;
  }

  getRole(): string {
    // Replace with actual logic to retrieve user role
    return localStorage.getItem('userRole') || '';
  }

  logout(): void {
    this.userRole = '';
    this.router.navigate(['/']);
  }
}
