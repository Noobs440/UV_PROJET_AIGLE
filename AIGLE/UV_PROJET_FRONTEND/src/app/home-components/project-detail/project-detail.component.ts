import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProjetService } from '../../services/projet.service';
import { DocumentService } from '../../services/document.service';
import { ListingService } from '../../services/listing.service';
import { CommentaireService } from '../../services/commentaire.service';
@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css',
  animations: [
    trigger('fadeUp', [
      state('void', style({ opacity: 0, transform: 'translateY(200px)' })),
      state('*', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', animate('600ms ease-out')),
    ]),

  ],
})
export class ProjectDetailComponent implements OnInit{

  projects:any[]=[];
  documents:any[]=[];
  selectedProjectId!: number;
  selectedProjectTitle!: string;
  projectStatus!:string;
  projectImage!:string;
  description!:string;
  views!:number;
  author!:string;
  category!:string;
  level!: string;
  type!:string;
  date!:string;
  email!:string;
  id!:number;
  user_id:any;
  commentaires: string[]=[];
  nameU:any;
  idU:any;
  proprio=false;
  

  constructor(
    private route:ActivatedRoute,
    private sanitizer: DomSanitizer,
    private projetService:ProjetService,
    private documentService: DocumentService,
    private projectByIdService:ListingService,
    private com:CommentaireService

  ){}

  selectedPdf:string="";

  previewDocument(Path: string) {
    let url=`${'http://localhost:8000'}${Path}`;
    window.open(url,'_blank');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.user_id=params['user_id'];
      this.selectedProjectTitle = params['title'];
      this.projectStatus=params['status'];
      this.projectImage=params['image'];
      this.description=params['description'];
      this.author=params['author'];
      this.category=params['category'];
      this.level=params['level'];
      this.type=params['type'];
      this.date=params['date'];
      this.views=params['views'];
      this.email=params['email'];
      if(params['name'] && params['id']){
        this.nameU = params['nameU'];
        this.idU = params['idU'];
      }else{
        this.nameU = null
        this.idU = null;
      }
    });
    this.projetService.countViews(this.id).subscribe({
      next:(value)=>{
        console.log(value)
      },
      error:()=>
      {}
    });

    this.projectByIdService.getApprovedProjectsById(this.user_id).subscribe({
      next: (data) => {
        this.projects = data;
        //this.totalPages = Math.ceil(this.projects.length / this.itemsPerPage);
        //this.updateDisplayedProjects();
      },
      error: () => {
        //this.isLoading = false;
      },
      complete: () => {
       // this.isLoading = false;
      }
    });

    this.documentService.getDocumentsByProject(this.id).subscribe(response => {
      this.documents = response;
    });
    this.com.getAllcommentsByprojects(this.id).subscribe(
      response => {
        this.commentaires = response.map((c: any) => c.texte);
        //this.commentaires = response.map((c: any) => c.date);
      // Si besoin, garde aussi response complet dans un autre tableau
        console.log(this.commentaires); }
    );
  }
  updateProjectDetails(project:any){
    this.id = project.id;
      //this.user_id=params['user_id'];
      this.selectedProjectTitle = project.title;
      this.projectStatus=project.status;
      this.projectImage=project.image;
      this.description=project.description;
      //this.author=project.author;
      this.category=project.category;
      //this.level=project.level;
      this.type=project.type;
      this.date=project.date;
      this.views=project.views;
      //this.email=params['email'];

      this.documentService.getDocumentsByProject(this.id).subscribe(response => {
        this.documents = response;
      });
  }
  isExpanded2 = false;
  isProjectExpanded2 = false;
  // Other component properties

  toggleExpand2() {
    this.isExpanded2 = !this.isExpanded2;
  }

  toggleProjectExpand2() {
    this.isProjectExpanded2 = !this.isProjectExpanded2;
  }


  isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  getFullImageUrl(imagePath: string): string {
    return `${'http://localhost:8000'}${imagePath}`;
  }
  getFullDocument(documentPath:string){
    return `${'http://localhost:8000'}${documentPath}`;
  }

}
