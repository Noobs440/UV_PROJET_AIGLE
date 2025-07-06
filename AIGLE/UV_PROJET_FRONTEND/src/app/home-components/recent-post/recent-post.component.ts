
import { Component, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AcceuilService } from '../../services/acceuil.service';
import { ProjetService } from '../../services/projet.service';
import { getProjectId } from '../../shared/utils/projetId';
import { PopupCommComponent } from '../popup-comm/popup-comm.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-recent-post',
  templateUrl: './recent-post.component.html',
  styleUrls: ['./recent-post.component.css'],
  animations: [
    trigger('fadeUp', [
      state('void', style({ opacity: 0, transform: 'translateY(200px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', animate('600ms ease-out')),
    ]),
  ],
})
export class RecentPostComponent implements OnInit {
  @Input() sectionClass: string = 'recent-posts section'; // default class
  @Input() bgColor: string = 's';
  @Input() fColor: string = '';
  @Input() pad!: string;
  @Input() prevButtonColor: string = 'blue'; // Default color for prev button
  @Input() nextButtonColor: string = '#000'; // Default color for next button

  chunkedPosts: any[] = [];
  data: any[] = [];
  private baseUrl: string = 'http://localhost:8000';
  maxElements: number = 16;
  allProjects:any;
  isLoading=false;
  nameU!: string | null;
  idU!: string | null;

  constructor(
    private acceuilService: AcceuilService, 
    private projectDetailService:ProjetService,
    private dialog: MatDialog,
    private userDataService: UserDataService
  ) {}


  ngOnInit(): void {
    this.isLoading=true
    this.acceuilService.getProjectsByOrder().subscribe({
      next: (data) => {
        this.data = data;
        this.chunkPosts();
        //this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      },
      complete: ()=>{
        this.isLoading = false;
      }
    });
    this.userDataService.userData$.subscribe(data => {
      if (data) {
        console.log('Nom reçu :', data.name );
        console.log('ID reçu :', data.id);
        this.nameU = data.name;
        this.idU = data.id;
      }
    });
    this.sendData();
  }

  sendData() {
    this.userDataService.setUserData({ name: this.nameU , id: this.idU });
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
      user_id:project.user_id
    };
  }

  chunkPosts(): void {
    const chunkSize = 8;
    const limitedPosts = this.data.slice(0, this.maxElements); // Limiter le nombre d'éléments
    for (let i = 0; i < limitedPosts.length; i += chunkSize) {
      this.chunkedPosts.push(limitedPosts.slice(i, i + chunkSize));
    }
  }

  getFullImageUrl(imagePath: string): string {
    return `${this.baseUrl}${imagePath}`;
  }

  open(post: any): void {
    const projetId = getProjectId(post);
    /*
    const urlParams = new URLSearchParams(window.location.search);
    const hasName = urlParams.has('name');
    const hasId = urlParams.has('id');

    if (hasName || hasId) {
    // Il y a au moins un des deux paramètres dans l'URL
    console.log('name ou id présent dans l’URL');
    } else {
    // Aucun des deux paramètres n’est présent
    console.log('Aucun paramètre name ou id dans l’URL');
    } 
      // TEST : Récupérer les paramètres name et id de l'URL et les afficher dans la console
    testRecupParams() {
      const urlParams = new URLSearchParams(window.location.search);
      const name = urlParams.get('name');
      const id = urlParams.get('id');
      console.log('Param name:', name);
      console.log('Param id:', id);
    }*/
    const dialogRef = this.dialog.open(PopupCommComponent, {
      width: '387px',
      height: '600px',
      data: { projetId, name: this.nameU , userId: this.idU }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      // Si le commentaire a été envoyé, on redirige vers le détail du projet
      if (result && result.commentSent) {
        // On récupère les queryParams actuels de l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        const id = urlParams.get('id');
        this.nameU = urlParams.get('nameU');
        const idU = urlParams.get('idU');
        
        console.log('name:', name);
        console.log('id:', id);
        console.log('name user:', this.nameU);
        console.log('id user:', idU);
        let queryParams: any = {};
        if (name && id) {
          queryParams = { name, id };
        }
        // Rediriger vers la page de détail du projet avec queryParams si présents
        window.location.href = `/homec/project-detail/${projetId}` + (Object.keys(queryParams).length ? `?name=${name}&id=${id}` : '');
      }
    });
  }
  getRoute(projectid:any) : string[]{
    const urlParams = new URLSearchParams(window.location.search);
    const hasName = urlParams.has('name');
    const hasId = urlParams.has('id');

    if (hasName || hasId) {
      // Il y a au moins un des deux paramètres dans l'URL
      console.log('name ou id présent dans l’URL', projectid.id);
      return ['/homec/project-detail', projectid.id];
      //homec/project-detail/:id
    } else {
      // Aucun des deux paramètres n’est présent
      console.log('Aucun paramètre name ou id dans l’URL', projectid.titre_projet);
      return ['/home/project-detail', projectid.id];
    }
    
  }
}
