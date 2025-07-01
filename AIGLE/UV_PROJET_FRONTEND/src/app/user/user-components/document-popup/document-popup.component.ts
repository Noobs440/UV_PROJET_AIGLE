import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from '../../../services/document.service';
import { CollaborateurService } from '../../../services/collaborateur.service';
import { SuperviseurService } from '../../../services/superviseur.service';

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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private documentService: DocumentService,
    private collaboratorService: CollaborateurService,
    private superviseurService: SuperviseurService
  ) {}

  ngOnInit(): void {
    this.formType = this.data.formType;
    this.projectId = this.data.id;

    // Récupération user_id depuis localStorage (Option 1)
    this.userId = parseInt(localStorage.getItem('user_id') || '0');

    // Initialisation des formulaires
    this.documentForm = this.fb.group({
      title: ['', Validators.required]
      // Le fichier est géré à part via selectedFile
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

  // Getters pour contrôle des erreurs dans le template
  get documentFormControl(): {[key: string]: AbstractControl} {
    return this.documentForm.controls;
  }
  get collaboratorFormControl(): {[key: string]: AbstractControl} {
    return this.collaboratorForm.controls;
  }
  get supervisorFormControl(): {[key: string]: AbstractControl} {
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
        formData.append('user_id', this.userId.toString()); // Ajout user_id

        this.documentService.addDocument(formData).subscribe({
          next: () => {
            alert('Document ajouté avec succès !');
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error(err);
            alert('Erreur lors de l\'ajout du document : ' + (err.error?.message || 'Erreur inconnue'));
          }
        });
      } else {
        alert('Veuillez sélectionner un fichier et renseigner le titre.');
      }
    }
    else if (this.formType === 'collaborator') {
      if (this.collaboratorForm.valid) {
        const { name, email } = this.collaboratorForm.value;
        this.collaboratorService.addCollaborateurToProject(this.projectId, { nom: name, email }).subscribe({
          next: () => {
            alert('Collaborateur ajouté avec succès au projet !');
            this.dialogRef.close(true);
          },
          error: () => alert('Erreur lors de l\'ajout du collaborateur au projet.')
        });
      } else {
        alert('Veuillez remplir correctement le formulaire collaborateur.');
      }
    }
    else if (this.formType === 'supervisor') {
      if (this.supervisorForm.valid) {
        const { name, email } = this.supervisorForm.value;
        this.superviseurService.addSuperviseurToProject(this.projectId, { nom: name, email }).subscribe({
          next: () => {
            alert('Superviseur ajouté avec succès au projet !');
            this.dialogRef.close(true);
          },
          error: () => alert('Erreur lors de l\'ajout du superviseur au projet.')
        });
      } else {
        alert('Veuillez remplir correctement le formulaire superviseur.');
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
