

import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjetstatusService } from '../../../services/projetstatus.service';
import { DocumentService } from '../../../services/document.service';
import { SubmitProjectService } from '../../../services/submit-project.service';
import { ProjetService } from '../../../services/projet.service';
import { MatDialog } from '@angular/material/dialog';
import { DocumentPopupComponent } from '../document-popup/document-popup.component';
import { CollaborateurService } from '../../../services/collaborateur.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { CompleteDialogComponent } from '../complete-dialog/complete-dialog.component';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit, OnDestroy {

  @ViewChild('confirmDialog') confirmDialog!: TemplateRef<any>;

  collaborators: any[] = [];
  documents: any[] = [];
  selectedProjectId = 0;
  selectedProjectTitle = '';
  projectStatus = '';
  projectImage = '';
  description = '';
  views = 0;
  author = '';
  category = '';
  level = '';
  type = '';
  date = '';
  email = '';
  id = 0;
  Submitted = false;

  user_id: string | null = null;
  user_role: string | null = null;
  user_name: string | null = null;
  user_token: string | null = null;
  confirm_message = '';
  isExpanded = false;
  projetOwnerId: string | null = null;

  private queryParamsSub?: Subscription;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private submitService: SubmitProjectService,
    private documentService: DocumentService,
    private projetService: ProjetService,
    private projetStatusService: ProjetstatusService,
    private collaborateurService: CollaborateurService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.user_id = localStorage.getItem('id');
    this.user_role = localStorage.getItem('role');
    this.user_name = localStorage.getItem('name');
    this.user_token = localStorage.getItem('token');

    this.selectedProjectId = Number(this.route.snapshot.paramMap.get('id')) || 0;

    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      this.id = Number(params['id']) || 0;
      this.selectedProjectTitle = params['title'] || '';
      this.projectStatus = params['status'] || '';
      this.projectImage = params['image'] || '';
      this.description = params['description'] || '';
      this.author = params['author'] || '';
      this.category = params['category'] || '';
      this.level = params['level'] || '';
      this.type = params['type'] || '';
      this.date = params['date'] || '';
      this.views = Number(params['views']) || 0;
      this.email = params['email'] || '';
    });
    this.projetService.countViews(this.id).subscribe({
      next: value => {
        console.log('Count views response:', value);
      },
      error: () => { }
    });

    this.documentService.getDocumentsByProject(this.id).subscribe(response => {
      this.documents = response;
    });
    this.collaborateurService.getCollaboratorsByProject(this.id).subscribe(response => {
      this.collaborators = response;
    });

    // Récupère l'id du créateur du projet
    this.projetService.getProjectById(this.id).subscribe((projet: any) => {
      this.projetOwnerId = projet.user_id?.toString();
    });

    this.actionCellRenderer();
  }

  isProjectOwner(): boolean {
    return !!this.user_id && !!this.projetOwnerId && this.user_id === this.projetOwnerId;
  }

  ngOnDestroy(): void {
    this.queryParamsSub?.unsubscribe();
  }


  approveProject(): void {
    if (!this.isProjectOwner()) {
      alert("Vous n'avez pas le droit d'approuver ce projet.");
      return;
    }
    this.projetStatusService.approveProject(this.id).subscribe({
      next: () => {
        this.projectStatus = 'Approved';
        const notifPayload = {
          projectId: this.id,
          collaboratorEmail: '',
          message: 'Le statut du projet a changé : approuvé.'
        };
        this.notificationService.sendProjectNotification(notifPayload).subscribe({
          next: () => {
            alert("Projet approuvé et notification envoyée à tous les collaborateurs.");
          },
          error: () => {
            alert("Projet approuvé, mais la notification n'a pas pu être envoyée.");
          }
        });
      },
      error: err => {
        alert("Erreur lors de l'approbation du projet");
        console.error(err);
      }
    });
  }

  rejectProject(): void {
    if (!this.isProjectOwner()) {
      alert("Vous n'avez pas le droit de rejeter ce projet.");
      return;
    }
    this.projetStatusService.rejectProject(this.id).subscribe({
      next: () => {
        this.projectStatus = 'Rejected';
        const notifPayload = {
          projectId: this.id,
          collaboratorEmail: '',
          message: 'Le statut du projet a changé : rejeté.'
        };
        this.notificationService.sendProjectNotification(notifPayload).subscribe({
          next: () => {
            alert("Projet rejeté et notification envoyée à tous les collaborateurs.");
          },
          error: () => {
            alert("Projet rejeté, mais la notification n'a pas pu être envoyée.");
          }
        });
      },
      error: err => {
        alert("Erreur lors du rejet du projet");
        console.error(err);
      }
    });
  }


  deleteProject(Projectid: number): void {
    this.projetService.deleteProject(Projectid).subscribe({
      next: () => {
        this.openCompleteDialog("Project deleted completely.");
      },
      error: err => {
        alert(`Erreur : ${err.status}`);
      },
      complete: () => {
        this.dialog.closeAll();
        const queryParams = {
          token: this.user_token,
          name: this.user_name,
          role: this.user_role,
          id: this.user_id
        };
        // Décommente la ligne suivante si tu veux rediriger après suppression
        // this.router.navigate([`/${this.user_role}/dashboard`], { queryParams });
      }
    });
  }

  openDocument(link: string): void {
    const fullPath = this.getFullImageUrl(link);
    if (fullPath) {
      window.open(fullPath, '_blank', 'noopener,noreferrer');
    } else {
      alert("Aucune image disponible");
    }
  }

  submitProject(): void {
    if (!this.isProjectOwner()) {
      alert("Vous n'avez pas le droit de soumettre ce projet.");
      return;
    }
    this.submitService.submitProject(this.id).subscribe({
      next: () => {
        // Notifier tous les collaborateurs et le créateur du projet
        const notifPayload = {
          projectId: this.id,
          collaboratorEmail: '', // Vide pour notifier tous les collaborateurs
          message: `Le statut du projet a changé : soumis.`
        };
        this.notificationService.sendProjectNotification(notifPayload).subscribe({
          next: () => {
            alert("Votre projet a été soumis et les collaborateurs ont été notifiés.");
            this.Submitted = true;
          },
          error: () => {
            alert("Votre projet a été soumis, mais la notification n'a pas pu être envoyée.");
            this.Submitted = true;
          }
        });
      },
      error: err => {
        alert("Votre projet doit contenir au moins un document");
        console.error(err);
      }
    });
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  openDialog(formType: string): void {
    if (!this.isProjectOwner()) {
      alert("Vous n'avez pas le droit d'ajouter des documents, collaborateurs ou superviseur.");
      return;
    }
    const dialogRef = this.dialog.open(DocumentPopupComponent, {
      width: '400px',
      height: '550px',
      data: {
        formType,
        id: this.id,           // ✅ Ajout de l'ID du projet
        user_id: this.user_id  // (optionnel, utile pour les documents)
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openDeleteDialog(templateRef: TemplateRef<any>): void {
    this.dialog.open(templateRef, {
      width: '350px',
      height: '200px',
      disableClose: false
    });
  }

  openCompleteDialog(message: string): void {
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
    if (!projectImage) {
      return '';
    }
    return projectImage.startsWith('http') ? projectImage : `http://localhost:8000/${projectImage.replace(/^\/+/,'')}`;
  }

  actionCellRenderer(): string {
    let status = this.projectStatus;
    let actionButtons = `
      <i class="view-button fas fa-eye text-primary" 
         style="border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; background-color: #f6f6fe; cursor: pointer;"></i>
    `;

    if (status === 'Pending') {
      actionButtons += `
        <i class="fas fa-check text-success" 
           style="border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; background-color: #e0f8e9; cursor: pointer;"></i>
        <i class="fas fa-trash-alt text-danger" 
           style="background-color: #ffecdf; border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; cursor: pointer;"></i>
      `;
    } else if (status === 'Approved') {
      actionButtons += `
        <i class="fas fa-times text-danger" 
           style="background-color: #ffecdf; border-radius: 50%; box-shadow: white; padding: 7px; font-size: 20px; cursor: pointer;"></i>
      `;
    }

    return actionButtons;
  }
}

