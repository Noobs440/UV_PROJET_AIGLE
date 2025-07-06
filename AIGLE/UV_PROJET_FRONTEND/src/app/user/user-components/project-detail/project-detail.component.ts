import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetstatusService } from '../../../services/projetstatus.service';
import { DocumentPopupComponent } from '../document-popup/document-popup.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DocumentService } from '../../../services/document.service';
import { SubmitProjectService } from '../../../services/submit-project.service';
import { ProjetService } from '../../../services/projet.service';
import { CollaborateurService } from '../../../services/collaborateur.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CompleteDialogComponent } from '../complete-dialog/complete-dialog.component';
import { DetailProjectComponent } from '../../../admin/admin-components/detail-project/detail-project.component';
import { CommentaireService }from'../../../services/commentaire.service';
import { response } from 'express';
import { PopupCommComponent } from '../../../home-components/popup-comm/popup-comm.component';
import { UserDataService } from '../../../services/user-data.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent {

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  documents: any[] = [];
  collaborators: any[] = [];
  selectedProjectId!: number;
  selectedProjectTitle!: string;
  projectStatus!: string;
  projectImage!: string;
  description!: string;
  views!: number;
  author!: string;
  category!: string;
  level!: string;
  type!: string;
  date!: string;
  email!: string;
  id!: number;
  Submitted = false;
  user_id:any
  user_role:any;
  user_name:any;
  user_token:any;
  confirm_message="";
  commentaires: string[]=[];
  proprio=false;

  constructor(
    private dialog: MatDialog,
    //private dialogRef:MatDialogRef<DetailProjectComponent>,
    private route: ActivatedRoute,
    private router: Router,
    private submitService: SubmitProjectService,
    private documentService: DocumentService,
    private collaborateurService: CollaborateurService,
    private projetService:ProjetService,
    private projetStatusService: ProjetstatusService,
    private com:CommentaireService,
    private userDataService:UserDataService
    //private commentaires:any
    //@Inject(MAT_DIALOG_DATA) public data: any
  ){
    //this.confirm_message=data.message;
  }

  ngOnInit(): void {
    this.user_id=localStorage.getItem('id')
    this.user_role=localStorage.getItem('role');
    this.user_name=localStorage.getItem('name');
    this.user_token=localStorage.getItem('token');
    this.selectedProjectId = +this.route.snapshot.paramMap.get('id')!;
    this.route.queryParams.subscribe(params => {
    this.id = params['id'];
    this.selectedProjectTitle = params['title'];
    this.projectStatus = params['status'];
    this.projectImage = params['image'];
    this.description = params['description'];
    this.author = params['author'];
    this.category = params['category'];
    this.level = params['level'];
    this.type = params['type'];
    this.date = params['date'];
    this.views = params['views'];
    this.email = params['email'];
    this.com.getAllcommentsByprojects(this.id).subscribe(
      response => {
        this.commentaires = response.map((c: any) => c.texte);
        //this.commentaires = response.map((c: any) => c.date);
      // Si besoin, garde aussi response complet dans un autre tableau
        console.log(this.commentaires); }
    );
    });
    this.projetService.countViews(this.id).subscribe({
      next:(value)=>{
        console.log(value)
      },
      error:()=>
      {}
    });
    this.userDataService.userData$.subscribe(data => {
      if (data) {
        console.log('Nom reçu :', data.name);
        console.log('ID reçu :', data.id);
        this.user_name = data.name;
        this.user_id = data.id;
      }
    });

    this.sendData();

    this.documentService.getDocumentsByProject(this.id).subscribe(response => {
      this.documents = response;
    });
    this.collaborateurService.geCollaborateurs().subscribe(response => {
      this.collaborators = response;
    });

    this.actionCellRenderer();
  }

  deleteProject(Projectid:any){
    this.projetService.deleteProject(Projectid).subscribe({
      next: value => {
        this.openCompleteDialog("Project deleted completely. ");
        this.dialog.closeAll();
      },
      error: err =>{
        alert(err.status);
        this.dialog.closeAll();
      },
      complete: ()=>{
        this.dialog.closeAll();
        const queryParams={
          token:this.user_token,
          name:this.user_name,
          role : this.user_role,
          id:this.user_id
         }
        //this.router.navigate([`/${this.user_role}/dashboard`],{queryParams})
      }
    }
    )
  }

  openDocument(link:any){
    let fullPath=`${link}`
    window.open(fullPath, '_blank', 'noopener,noreferrer');
  }

  onchat(){}

  submitProject() {
    this.submitService.submitProject(this.id).subscribe({
      next: value => {
        alert("Votre projet a été soumis");
      },
      error: err => {
        alert("Votre projet doit contenir au moins un document");
        console.log(err);
      },
      complete: () => {
        this.Submitted = true;
      }
    });
  }

  isExpanded = false;
  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  openDialog(formType: any) {
    const dialogRef = this.dialog.open(DocumentPopupComponent, {
      width: '400px',
      height: '550px',
      data: { formType: formType }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDeleteDialog(templateRef: TemplateRef<any>) {
    const dialogRef = this.dialog.open(templateRef, {
      width: '350px',
      height: '200px',
      // hasBackdrop: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCompleteDialog(message:string) {
    const dialogRef = this.dialog.open(CompleteDialogComponent, {
      width: '350px',
      height: '200px',
      data:{message},
      // hasBackdrop: false,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  sendData() {
    this.userDataService.setUserData({ name: this.user_name, id: this.user_id });
  }
  open(){
    const projetId = this.id;
    const userId = this.user_id;

      const dialogRef = this.dialog.open(PopupCommComponent, {
        width: '387px',
        height: '600px',
        data: { projetId, userId },
        
      });
      console.log("projet ", projetId);
      console.log("user ", userId);
      dialogRef.afterClosed().subscribe((result: any) => {
        // Si le commentaire a été envoyé, on redirige vers le détail du projet
        if (result && result.commentSent) {
          // On récupère les queryParams actuels de l'URL
          const urlParams = new URLSearchParams(window.location.search);
          const name = urlParams.get('name');
          const id = urlParams.get('id');
          
          console.log('name:', name);
          console.log('id:', id);
          let queryParams: any = {};
          if (name && id) {
            queryParams = { name, id };
          }
          // Rediriger vers la page de détail du projet avec queryParams si présents
          window.location.href = `/homec/project-detail/${projetId}` + (Object.keys(queryParams).length ? `?name=${name}&id=${id}` : '');
        }
      });
  }

  onClose(): void {
    this.dialog.closeAll();
  }

  getFullImageUrl(imagePath: string): string {
    return `${'http://localhost:8000'}${imagePath}`;
  }

  confirmDeleteDocument(document: any) {
  const confirmed = window.confirm(`Cette action est irréversible, voulez-vous vraiment supprimer votre document "${document.nom_doc}" ?`);
    if (confirmed) {
      this.deleteDocumentByid(document.id);
    }
  }

  deleteDocumentByid(id:string){
  this.documentService.deleteDocument(id).subscribe({
    next: () => {
      this.documents = this.documents.filter(document => document.id !== id);
      this.openCompleteDialog("Votre document a été supprimé avec succès.");
    },
      error: err => {
        console.error("Erreur lors de la suppression du document", err);
        alert("Une erreur s'est produite lors de la suppression du document.");
      }
    });
  }


  actionCellRenderer() {
    let status = this.projectStatus;
    let actionButtons = `
      <i class="view-button fas fa-eye text-primary" style="border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; background-color: #f6f6fe; cursor: pointer;"></i>
    `;

    if (status === 'Pending') {
      actionButtons += `
        <i class="fas fa-check text-success" style="border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; background-color: #e0f8e9; cursor: pointer;"></i>
        <i class="fas fa-trash-alt text-danger" style="background-color: #ffecdf; border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; cursor: pointer;"></i>
      `;
    } else if (status === 'Approved') {
      actionButtons += `
        <i class="fas fa-times text-danger" style="background-color: #ffecdf; border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; cursor: pointer;"></i>
      `;
    }

    return actionButtons;
  }

}
