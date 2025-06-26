import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CollaborateurService } from '../../../services/collaborateur.service';
import { SuperviseurService } from '../../../services/superviseur.service';
import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-document-popup',
  templateUrl: './document-popup.component.html',
  styleUrl: './document-popup.component.css'
})
export class DocumentPopupComponent {
  collaboratorForm!: FormGroup;
  supervisorForm!: FormGroup;
  documentForm!: FormGroup;
  submitted = false;
  selectedFile!: File;
  today: any;
  id: any;
  user_id: any;
  formType!:string;
  constructor(
    private dialogRef: MatDialogRef<DocumentPopupComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private documentService: DocumentService,
    private route: ActivatedRoute,
    private colService:CollaborateurService,
    private supService:SuperviseurService,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit() {
    this.formType = this.data.formType;
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      file: ['', Validators.required],
    });
    this.collaboratorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.supervisorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.user_id = params['user_id'];
    });


  }

  get documentFormControl() {
    return this.documentForm.controls;
  }
  get collaboratorFormControl() {
    return this.collaboratorForm.controls;
  }
  get supervisorFormControl() {
    return this.supervisorForm.controls;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.formType === 'document' && this.documentForm.valid) {
      this.submitted = true;
    if (this.documentForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('nom_doc', this.documentForm.value.title);
      formData.append('user_id', this.user_id);
      formData.append('tbl_projet_id', this.id);
      formData.append('document', this.selectedFile);

      this.documentService.addDocument(formData).subscribe({
          next: value => {
            console.log(value);
            alert("votre document a ete creer avec succes");

          },
          error: err => {
            console.log(err);
            alert("erreur l'ors de la creation");
          },
          complete: () => {
            this.dialogRef.close(this.documentForm.value);
            //window.location.reload();

          }
        });
    } else {
      console.error('Form is invalid or image not selected');
    }
    } else if (this.formType === 'collaborator' && this.collaboratorForm.valid) {
      this.colService.addCollaborateur(this.collaboratorForm.value.name, this.collaboratorForm.value.email).subscribe({
        next: value => {
          alert("collaborateur ajouter avec succes");
        },
        error: err=>{
          console.log(err);
          alert("erreur l'ors de l'ajout");
        },
        complete: ()=>{
          this.dialogRef.close(this.collaboratorForm.value);
          window.location.reload();

        }
      });


    } else if (this.formType === 'supervisor' && this.supervisorForm.valid) {
      this.supService.addSuperviseur(this.supervisorForm.value.name, this.supervisorForm.value.email).subscribe({
        next: value => {
          alert("superviseur ajouter avec succes");
        },
        error: err=>{
          console.log(err);
          alert("erreur l'ors de l'ajout");
        },
        complete: ()=>{
          this.dialogRef.close(this.supervisorForm.value);
          window.location.reload();
        }
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.documentForm.patchValue({
        file: this.selectedFile.name
      });
    }
  }

}
