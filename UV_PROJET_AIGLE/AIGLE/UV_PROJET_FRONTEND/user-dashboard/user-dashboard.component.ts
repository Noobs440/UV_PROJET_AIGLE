import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SubmitPopupComponent } from '../src/app/user/user-components/submit-popup/submit-popup.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingService } from '../src/app/services/listing.service';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit{
  token!: string;
  name!: string;
  role!: string;
  id!: any;
  projects: any[] = [];
  selectedProject: any[] = [];
  isLoading = false;
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;

  constructor(private router: Router, private route: ActivatedRoute, private dialog: MatDialog, private ProjectByIdService: ListingService) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.name = params['name'];
      this.role = params['role'];
      this.id = params['id'];
    });
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
    dialogConfig.width='400px';
    dialogConfig.height='620px';

    this.dialog.open(SubmitPopupComponent,dialogConfig );


  }
}
