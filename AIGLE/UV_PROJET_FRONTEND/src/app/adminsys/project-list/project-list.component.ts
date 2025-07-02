import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../../services/projet.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {

  projects: any[] = [];
  filteredProjects: any[] = [];
  currentProject: any = {};

  searchTerm: string = '';
  sortAsc: boolean = true;

  isModalOpen = false;
  isEditMode = false;

  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;

  selectedImageFile?: File;

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projetService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Erreur chargement projets', err);
        this.projects = [];
        this.filteredProjects = [];
      }
    });
  }

  applyFilters(): void {
    let filtered = this.projects.filter(proj => {
      return proj.titre_projet.toLowerCase().includes(this.searchTerm.toLowerCase());
    });

    // Tri alphabétique sur titre_projet
    filtered = filtered.sort((a, b) => {
      if (a.titre_projet < b.titre_projet) return this.sortAsc ? -1 : 1;
      if (a.titre_projet > b.titre_projet) return this.sortAsc ? 1 : -1;
      return 0;
    });

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages || 1;
    if (this.currentPage < 1) this.currentPage = 1;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredProjects = filtered.slice(start, start + this.itemsPerPage);
  }

  toggleSort(): void {
    this.sortAsc = !this.sortAsc;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  goToPage(page: number): void {
    if(page >=1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFilters();
    }
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentProject = {
      titre_projet: '',
      descript_projet: '',
      tbl_niveau_id: '',
      tbl_categorie_id: '',
      user_id: '',
      views: '',
      image: '',
      status: '',
      type: '',
      soumis: ''
    };
    this.selectedImageFile = undefined;
    this.isModalOpen = true;
  }

  openEditModal(proj: any): void {
    this.isEditMode = true;
    // Copier l'objet pour éviter de modifier directement la liste
    this.currentProject = {...proj};
    this.selectedImageFile = undefined;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.currentProject = {};
    this.selectedImageFile = undefined;
  }

  onFileSelected(event: any): void {
    if(event.target.files && event.target.files.length > 0){
      this.selectedImageFile = event.target.files[0];
    }
  }

  saveProject(): void {
    const formData = new FormData();
    formData.append('titre_projet', this.currentProject.titre_projet);
    formData.append('descript_projet', this.currentProject.descript_projet);
    formData.append('tbl_niveau_id', this.currentProject.tbl_niveau_id?.toString() || '');
    formData.append('tbl_categorie_id', this.currentProject.tbl_categorie_id?.toString() || '');
    formData.append('user_id', this.currentProject.user_id?.toString() || '');
    formData.append('views', (this.currentProject.views || 0).toString());
    formData.append('status', this.currentProject.status);
    formData.append('type', this.currentProject.type);
    formData.append('soumis', this.currentProject.soumis ? '1' : '0');

    if(this.selectedImageFile){
      formData.append('image', this.selectedImageFile);
    } else if(this.currentProject.image){
      // Si pas de nouveau fichier, envoie juste l’ancienne valeur image (chaine)
      formData.append('image', this.currentProject.image);
    } else {
      // Peut-être gérer le cas sans image
      formData.append('image', '');
    }

    if(this.isEditMode){
      this.projetService.updateProjectMultipart(this.currentProject.id, formData).subscribe({
        next: () => {
          alert('Projet modifié avec succès');
          this.closeModal();
          this.loadProjects();
        },
        error: (err) => {
          console.error('Erreur modification projet', err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.projetService.addProject(formData).subscribe({
        next: () => {
          alert('Projet ajouté avec succès');
          this.closeModal();
          this.loadProjects();
        },
        error: (err) => {
          console.error('Erreur ajout projet', err);
          alert('Erreur lors de l\'ajout');
        }
      });
    }
  }

  deleteProject(id: number): void {
    if(confirm('Voulez-vous vraiment supprimer ce projet ?')){
      this.projetService.deleteProject(id).subscribe({
        next: () => {
          alert('Projet supprimé');
          this.loadProjects();
        },
        error: (err) => {
          console.error('Erreur suppression projet', err);
          alert('Erreur lors de la suppression');
        }
      });
    }
  }
}
