import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isLoading = true;
  sectionClass: string = 'recent-posts section';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Redirection automatique si connecté
    if (this.authService.getUser()) {
      this.router.navigate(['/home-connected']);
      return;
    }
    this.sectionClass = 'different-class';
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  }

  getFullImageUrl(projectImage: string): string {
    if (!projectImage) {
      return '';
    }
    return projectImage.startsWith('http') ? projectImage : `http://localhost:8000/${projectImage.replace(/^\/+/, '')}`;
  }
}
