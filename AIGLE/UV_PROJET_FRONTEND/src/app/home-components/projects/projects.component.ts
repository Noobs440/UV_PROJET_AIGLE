import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AcceuilService } from './../../services/acceuil.service';
import { FiliereService } from '../../services/filiere.service';
import { NiveauService } from '../../services/niveau.service';
import { CategoryService } from '../../services/category.service';
import { RechercheService } from '../../services/recherche.service';
import { ActivatedRoute } from '@angular/router';
import { PopupCommComponent } from '../popup-comm/popup-comm.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ElementRef, Renderer2 } from '@angular/core';
import { getProjectId } from '../../shared/utils/projetId';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  animations: [
    trigger('fadeUp', [
      state('void', style({ opacity: 0, transform: 'translateY(200px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', animate('600ms ease-out')),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {
  @Input() sectionClass: string = 'recent-posts section';
  @Input() bgColor: string = '#06BBCC';
  @Input() fColor: string = 'white';
  @Input() pad!: string;
  @Input() prevButtonColor: string = 'blue';
  @Input() nextButtonColor: string = '#000';
  @Input() bgColor1: string = '';
  status:any;

  showPopup=false;

  private baseUrl: string = 'http://localhost:8000';
  data: any[] = [];
  categories: any[] = [];
  filieres: any[] = [];
  niveaux: any[] = [];

  filteredPosts: any[] = [];
  // Tableau global des ids de tous les projets de la plateforme
  allProjectIds: number[] = [];
  paginatedPosts: any[] = [];
  chunkedPosts: any[][] = [];
  currentPage = 1;
  itemsPerPage = 8;
  totalPages = 1;
  pages: any = [];
  noResults: boolean = false;

  selectedFilliere = '';
  selectedNiveau = '';
  selectedDomain = '';
  searchQuery = '';
  nameU:any;
  idU:any;
  route1:string="";


  constructor(
    private categorieService: CategoryService,
    private niveauService: NiveauService,
    private filiereService: FiliereService,
    private acceuilService: AcceuilService,
    private rechercheService: RechercheService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {}
  isLoading=false
  ngOnInit(): void {
    this.isLoading=true;
    this.acceuilService.getProjectsByOrder().subscribe({
      next:(data) => {
        this.data = data;
        // Remplit le tableau global des ids de tous les projets (en int)
        //this.allProjectIds = this.data.map(p => getProjectId(p)).filter(id => typeof id === 'number');
        this.applyFilters();
        this.isLoading=false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
      complete: ()=>{
        this.isLoading = false;
      }

    });

    this.categorieService.getCategories().subscribe(categories => {
      this.categories = categories;
    });

    this.filiereService.getFilieres().subscribe(filieres => {
      this.filieres = filieres;
    });

    this.niveauService.getNiveaux().subscribe(niveaux => {
      this.niveaux = niveaux;
    });

    this.route.queryParams.subscribe(params => {
      // Récupération de la recherche
      if (params['search']) {
        this.searchQuery = params['search'];
        this.searchProjects();
      }

      // Récupération des ids envoyés par hero-section
      if (params['ids']) {
        // Les ids sont des bigint, donc on les traite comme des chaînes pour éviter toute perte de précision
        const ids = params['ids']
          .split(',')
          .map((id: string) => id.trim())
          .filter((id: string) => id !== '');
        // Filtrer les projets selon ces ids après chargement des données
        setTimeout(() => {
          this.filteredPosts = this.data.filter(p => ids.includes(String(getProjectId(p))));
          this.chunkedPosts = this.chunkArray(this.filteredPosts, this.itemsPerPage);
          this.totalPages = this.chunkedPosts.length;
          this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
          this.goToPage(1);
          this.noResults = this.filteredPosts.length === 0;
        }, 0);
      }
    });
    this.route.queryParams.subscribe(params => {
      if(params['name'] && params['id']){
        this.nameU = params['name'];
        this.idU = params['id'];
        console.log("this.nameU", this.nameU);
      }else{
        this.nameU = null
        this.idU = null;
      }
    });
  }

  getProjectQueryParams(project: any) {
    return {
      title: project.titre_projet,
      status: project.status,
      image: project.image,
      description: project.descript_projet,
      views:project.views,
      author:project.nom_utilisateur,
      category: project.nom_categorie,
      level: project.niveau,
      type: project.type,
      date:project.created_at,
      email:project.email,
      id:project.id,
      user_id:project.user_id,
      nameU:this.nameU,
      idU:this.idU
    };
  }

  getRoute(projectid:any) : any{
    const urlParams = new URLSearchParams(window.location.search);
    const hasName = urlParams.has('name');
    const hasId = urlParams.has('id');

    if (hasName || hasId) {
      // Il y a au moins un des deux paramètres dans l'URL
      console.log('name ou id présent dans l’URL', projectid.id);
      return "['/homec/project-detail', projectid.id]";
      //homec/project-detail/:id
    } else {
      // Aucun des deux paramètres n’est présent
      console.log('Aucun paramètre name ou id dans l’URL', projectid.titre_projet);
      return "['/home/project-detail', projectid.id]";
    }
    
    /*this.route.queryParams.subscribe(params => {
      if(params['name'] && params['id']){
        this.nameU = params['name'];
        this.idU = params['id'];
        console.log("this.nameU", this.nameU);
        this.route1="['/homec/project-detail', projectid.id]";

      }else{
        this.nameU = null
        this.idU = null;
        this.route1= "['/homec/project-detail', projectid.id]";
      }
      return this.route1;
    });*/


    /*if(this.nameU!=null  || this.idU!=null){
      return "['/homec/project-detail', projectid.id]";
    }else{
      return "['/homec/project-detail', projectid.id]";
    }*/
  }

  applyFilters() {
    this.filteredPosts = this.data;

    if (this.selectedFilliere) {
      this.filteredPosts = this.filteredPosts.filter(post => post.filiere === this.selectedFilliere);
    }

    if (this.selectedNiveau) {
      this.filteredPosts = this.filteredPosts.filter(post => post.niveau === this.selectedNiveau);
    }

    if (this.selectedDomain) {
      this.filteredPosts = this.filteredPosts.filter(post => post.nom_categorie === this.selectedDomain);
    }

    if (this.searchQuery) {
      this.filteredPosts = this.filteredPosts.filter(post =>
        post.titre_projet.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        post.nom_utilisateur.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.chunkedPosts = this.chunkArray(this.filteredPosts, this.itemsPerPage);
    this.totalPages = this.chunkedPosts.length;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.goToPage(1);
    this.noResults = this.filteredPosts.length === 0;
  }

  searchProjects() {
    this.rechercheService.searchProjects(this.searchQuery).subscribe(response => {
    this.filteredPosts = response.results;
    console.log('Résultats de la recherche:', response.results);
    this.filteredPosts.forEach(p => console.log('Projet:', p, 'ID:', getProjectId(p)));
    const projectIds = this.filteredPosts
      .map(project => getProjectId(project))
      .filter(id => id !== undefined);
    console.log('IDs des projets filtrés:', projectIds);
    // ...pagination...
     this.chunkedPosts = this.chunkArray(this.filteredPosts, this.itemsPerPage);
      this.totalPages = this.chunkedPosts.length;
      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.goToPage(1);
      this.noResults = this.filteredPosts.length === 0;
    })
  }

  chunkArray(arr: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      result.push(arr.slice(i, i + chunkSize));
    }
    return result;
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
      this.paginatedPosts = this.chunkedPosts[pageNumber - 1] || [];
    }
  }

  clearFilters() {
    this.selectedFilliere = '';
    this.selectedNiveau = '';
    this.selectedDomain = '';
    this.searchQuery = '';
    this.applyFilters();
  }

  getFullImageUrl(imagePath: string): string {
    return `${this.baseUrl}${imagePath}`;
  }

  open(post: any): void {
    // Version simple : ouvre la popup commentaire avec l'id du projet cliqué, sans gestion de filtre ou de tableau global
    const projetId = getProjectId(post);
    const dialogRef = this.dialog.open(PopupCommComponent, {
      width: '387px',
      height: '600px',
      data: { projetId }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      console.log('The dialog was closed');
    });
  }
}
