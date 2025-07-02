import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetstatusService } from '../../../services/projetstatus.service';
import { DocumentPopupComponent } from '../document-popup/document-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DocumentService } from '../../../services/document.service';
import { SubmitProjectService } from '../../../services/submit-project.service';
import { ProjetService } from '../../../services/projet.service';
import { CollaborateurService } from '../../../services/collaborateur.service';
import { CompleteDialogComponent } from '../complete-dialog/complete-dialog.component';
import { CollaborateurEditPopupComponent } from '../../collaborateur-edit-popup/collaborateur-edit-popup.component'

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
  nom_collab:any;
  email_collab:any;
  user_id: any;
  user_role: any;
  user_name: any;
  user_token: any;
  confirm_message = "";

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private submitService: SubmitProjectService,
    private documentService: DocumentService,
    private collaborateurService: CollaborateurService,
    private projetService: ProjetService,
    private projetStatusService: ProjetstatusService,
  ) {}

  ngOnInit(): void {
    this.nom_collab = localStorage.getItem('nom_collab');
    this.user_id = localStorage.getItem('id');
    this.user_role = localStorage.getItem('role');
    this.user_name = localStorage.getItem('name');
    this.user_token = localStorage.getItem('token');
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
    });

    this.projetService.countViews(this.id).subscribe();

    this.documentService.getDocumentsByProject(this.id).subscribe(res => this.documents = res);
    this.collaborateurService.getCollaborateursByProject(this.id).subscribe(res => this.collaborators = res);

    this.actionCellRenderer();
  }

  deleteProject(Projectid: any) {
    this.projetService.deleteProject(Projectid).subscribe({
      next: () => this.openCompleteDialog("Project deleted completely."),
      error: err => alert(err.status),
      complete: () => this.dialog.closeAll()
    });
  }

  openDocument(link: any) {
    window.open(`${link}`, '_blank', 'noopener,noreferrer');
  }

  submitProject() {
    this.submitService.submitProject(this.id).subscribe({
      next: () => alert("Votre projet a été soumis"),
      error: err => alert("Votre projet doit contenir au moins un document"),
      complete: () => this.Submitted = true
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
      data: {
        formType,
       nom_collab:this.nom_collab,
       email_collab:this.email_collab,
        id: this.id,
        user_id: this.user_id
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.collaborateurService.getCollaborateursByProject(this.id).subscribe(res => this.collaborators = res);
    });
  }

  openDeleteDialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '350px',
      height: '200px',
      disableClose: false
    });
  }

  openCompleteDialog(message: string) {
    this.dialog.open(CompleteDialogComponent, {
      width: '350px',
      height: '200px',
      data: { message },
      disableClose: false
    });
  }

  onClose(): void {
    this.dialog.closeAll();
  }

  getFullImageUrl(projectImage: string): string {
    if (!projectImage) return '';
    return projectImage.startsWith('http')
      ? projectImage
      : `http://localhost:8000${projectImage.startsWith('/') ? '' : '/'}${projectImage}`;
  }

  actionCellRenderer() {
    let status = this.projectStatus;
    let actionButtons = `<i class="view-button fas fa-eye text-primary" style="..."></i>`;

    if (status === 'Pending') {
      actionButtons += `<i class="fas fa-check text-success" style="..."></i>
                        <i class="fas fa-trash-alt text-danger" style="..."></i>`;
    } else if (status === 'Approved') {
      actionButtons += `<i class="fas fa-times text-danger" style="..."></i>`;
    }

    return actionButtons;
  }

  confirmDeleteDocument(document: any) {
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer le document "${document.nom_doc}" ?`);
    if (confirmed) this.deleteDocumentByid(document.id);
  }

  deleteDocumentByid(id: string) {
    this.documentService.deleteDocument(id).subscribe({
      next: () => {
        this.documents = this.documents.filter(doc => doc.id !== id);
        this.openCompleteDialog("Votre document a été supprimé avec succès.");
      },
      error: err => {
        console.error("Erreur lors de la suppression", err);
        alert("Erreur lors de la suppression du document.");
      }
    });
  }

  confirmDeleteCollaborator(collaborator: any) {
    const confirmed = window.confirm(`Supprimer le collaborateur "${collaborator.nom_collab}" ?`);
    if (confirmed) this.deleteCollaboratorById(collaborator.id);
  }

  deleteCollaboratorById(id: string) {
    this.collaborateurService.deleteCollaborateur(id).subscribe({
      next: () => {
        this.collaborators = this.collaborators.filter(c => c.id !== id);
        this.openCompleteDialog("Le collaborateur a été supprimé avec succès.");
      },
      error: err => {
        console.error("Erreur suppression collaborateur", err);
        alert("Erreur lors de la suppression.");
      }
    });
  }

  editCollaborator(collaborator: any) {
    this.dialog.open(CollaborateurEditPopupComponent, {
      width: '450px',
      data: {
        collaborator,
      tbl_projet_id: this.id,
      user_id: this.user_id

      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.collaborateurService.getCollaborateursByProject(this.id).subscribe(res => {
          this.collaborators = res;
        });
      }
    });
  }
}
