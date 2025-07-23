import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from '../../../services/document.service';
import { CollaborateurService } from '../../../services/collaborateur.service';
import { SuperviseurService } from '../../../services/superviseur.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-document-popup',
  templateUrl: './document-popup.component.html',
  styleUrls: ['./document-popup.component.css']
})
export class DocumentPopupComponent implements OnInit {

  formType!: 'document' | 'collaborator' | 'supervisor';
  projectId!: number;

  documentForm!: FormGroup;
  collaboratorForm!: FormGroup;
  supervisorForm!: FormGroup;

  selectedFile: File | null = null;
  submitted = false;
  userId!: number;

  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';
  showAlert: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: DocumentService,
    private colService: CollaborateurService, // ✅ corrigé ici
    private supService: SuperviseurService,   // ✅ corrigé ici
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.formType = this.data.formType;
    this.projectId = this.data.id;

    this.userId = parseInt(localStorage.getItem('user_id') || '0');

    this.documentForm = this.fb.group({
      title: ['', Validators.required]
    });

    this.collaboratorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.supervisorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get documentFormControl(): { [key: string]: AbstractControl } {
    return this.documentForm.controls;
  }

  get collaboratorFormControl(): { [key: string]: AbstractControl } {
    return this.collaboratorForm.controls;
  }

  get supervisorFormControl(): { [key: string]: AbstractControl } {
    return this.supervisorForm.controls;
  }

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.formType === 'document') {
      if (this.documentForm.valid && this.selectedFile) {
        const formData = new FormData();
        formData.append('nom_doc', this.documentForm.value.title);
        formData.append('fichier', this.selectedFile);
        formData.append('tbl_projet_id', this.projectId.toString());
        formData.append('user_id', this.userId.toString());

        this.documentService.addDocument(formData).subscribe({
          next: () => {
            this.alertType = 'success';
            this.alertMessage = 'Document ajouté avec succès !';
            this.showAlert = true;
            setTimeout(() => {
              this.showAlert = false;
              this.dialogRef.close(true);
            }, 2000);
          },
          error: (err) => {
            console.error(err);
            this.alertType = 'error';
            this.alertMessage = 'Erreur lors de l\'ajout du document : ' + (err.error?.message || 'Erreur inconnue');
            this.showAlert = true;
          }
        });
      } else {
        this.alertType = 'error';
        this.alertMessage = 'Veuillez sélectionner un fichier et renseigner le titre.';
        this.showAlert = true;
      }

    } else if (this.formType === 'collaborator' && this.collaboratorForm.valid) {
      // Correction : mapping explicite des champs pour le backend
      this.colService.addCollaborateur(
        this.collaboratorForm.value.name,
        this.collaboratorForm.value.email,
        this.projectId.toString(),
        this.userId.toString()
      ).subscribe({
        next: () => {
          // Envoi notification au collaborateur ajouté et au créateur
          const notifPayload = {
            projectId: this.projectId,
            collaboratorEmail: this.collaboratorForm.value.email,
            message: `Vous avez été ajouté comme collaborateur au projet. Cliquez ici pour voir le projet.`
          };
          this.notificationService.sendProjectNotification(notifPayload).subscribe({
            next: () => {
              this.alertType = 'success';
              this.alertMessage = 'Collaborateur ajouté et notification envoyée !';
              this.showAlert = true;
            },
            error: (err) => {
              this.alertType = 'error';
              this.alertMessage = "Collaborateur ajouté, mais erreur lors de l'envoi de la notification.";
              this.showAlert = true;
            },
            complete: () => {
              this.dialogRef.close(this.collaboratorForm.value);
              window.location.reload();
            }
          });
        },
        error: (err) => {
          console.error(err);
          this.alertType = 'error';
          this.alertMessage = "Erreur lors de l'ajout du collaborateur : " + (err.error?.message || 'Erreur inconnue');
          this.showAlert = true;
        }
      });

    } else if (this.formType === 'supervisor' && this.supervisorForm.valid) {
      this.supService.addSuperviseur(
        this.supervisorForm.value.name,
        this.supervisorForm.value.email
      ).subscribe({
        next: () => {
          this.alertType = 'success';
          this.alertMessage = 'Superviseur ajouté avec succès !';
          this.showAlert = true;
        },
        error: (err) => {
          console.error(err);
          this.alertType = 'error';
          this.alertMessage = "Erreur lors de l'ajout du superviseur.";
          this.showAlert = true;
        },
        complete: () => {
          this.dialogRef.close(this.supervisorForm.value);
          window.location.reload();
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
