import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubmitPopupComponent } from '../user-components/submit-popup/submit-popup.component';
import { Router } from '@angular/router';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']  // corrigé styleUrls au pluriel
})
export class UserDashboardComponent implements OnInit {
  token!: string | null;
  name!: string | null;
  role!: string | null;
  id!: string | null;
  projects: any[] = [];
  selectedProject: any[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  constructor(private router: Router, private dialog: MatDialog, private ProjectByIdService: ListingService) { }

  ngOnInit(): void {
    this.isLoading = true;

    // Récupérer les infos utilisateur depuis localStorage
    this.token = localStorage.getItem('token');
    this.name = localStorage.getItem('name');
    this.role = localStorage.getItem('role');
    this.id = localStorage.getItem('id');

    // Si pas de token, rediriger vers home (ou login)
    if (!this.token) {
      this.router.navigate(['/home']);
      return;
    }

    // Charger les projets avec l'id utilisateur
    this.ProjectByIdService.getProjectsById(this.id).subscribe({
      next: (data) => {
        this.projects = data;
        this.totalPages = Math.ceil(this.projects.length / this.itemsPerPage);
        this.updateDisplayedProjects();
      },
      error: () => {
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateDisplayedProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.selectedProject = this.projects.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateDisplayedProjects();
    }
  }

  getProjectQueryParams(project: any) {
    return {
      id: project.id,
      user_id: project.user_id,
      title: project.titre,
      status: project.status,
      image: project.image,
      description: project.description,
      views: project.views,
      author: project.nom_utilisateur,
      category: project.nom_categorie,
      level: project.niveau,
      type: project.type,
      date: project.created_at,
      email: project.email
    };
  }

  getFullImageUrl(projectImage: string) {
    return `http://localhost:8000${projectImage}`;
  }

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.width = '400px';
    dialogConfig.height = '620px';

    this.dialog.open(SubmitPopupComponent, dialogConfig);
  }
}
