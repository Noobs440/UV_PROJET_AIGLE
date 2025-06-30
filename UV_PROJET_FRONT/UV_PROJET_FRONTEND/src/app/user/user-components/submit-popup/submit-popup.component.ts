import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ProjetService } from '../../../services/projet.service';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { NiveauService } from '../../../services/niveau.service';
import { DocumentService } from '../../../services/document.service';
import { CollaborateurService } from '../../../services/collaborateur.service';
import { SuperviseurService } from '../../../services/superviseur.service';
import { response } from 'express';

@Component({
  selector: 'app-submit-popup',
  templateUrl: './submit-popup.component.html',
  styleUrls: ['./submit-popup.component.css'],
  providers: [DatePipe]
})
export class SubmitPopupComponent implements OnInit {
  creationForm!: FormGroup;
  documentForm!:FormGroup;
  collaboratorForm!:FormGroup;
  supervisorForm!:FormGroup;
  selectedFile!: File;
  today: any;
  token!: string;
  name!: string;
  role!: string;
  id: any;
  categories:any[]=[];
  niveaux: any[]=[];
  categories_name: any[]=[];
  categories_id: any[]=[];
  niveaux_name: any[]=[];
  niveaux_id: any[]=[];
  projets:any[]=[];
  projets_type:any[]=[];
  projet:any[]=[];
  isLoading=false;
  ErrorMessage=""
  submitted=false;
  formType='project';
  user_id: any;

  constructor(
    private supService:SuperviseurService,
    private colService:CollaborateurService,
    private documentService:DocumentService,
    private dialogRef: MatDialogRef<SubmitPopupComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private datePipe: DatePipe,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private categoryService:CategoryService,
    private niveauService:NiveauService
  ) { }

  ngOnInit() {
    this.creationForm = this.fb.group({
      title: ['', Validators.required],
      type: ['', Validators.required],
      file: [null, Validators.required],
      niveau: ['', Validators.required],
      category: ['', Validators.required],
      summary: ['', Validators.required],

    });
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      file: ['', Validators.required],
    });
    this.collaboratorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
    this.supervisorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.name = params['name'];
      this.role = params['role'];
      this.id = params['id'];
      this.user_id=params['id'];
    });
    this.today = this.datePipe.transform(new Date(), 'dd-MM-yyyy') || '';

    this.categoryService.getCategories().subscribe(data=>
    {
      this.categories = data;
      for (var k = 0; k < this.categories.length; k++) {
        this.categories_id.push(this.categories[k].id);
      }
      for (var k = 0; k < this.categories.length; k++) {
        this.categories_name.push(this.categories[k].nom_cat);
      }
    });

    this.niveauService.getNiveaux().subscribe(niveaux=>
    {
      this.niveaux = niveaux;
      for (var k = 0; k < this.niveaux.length; k++) {
        this.niveaux_id.push(this.niveaux[k].id);
      }
      for (var k = 0; k < this.niveaux.length; k++) {
        this.niveaux_name.push(this.niveaux[k].code_niv);
      }
    });

    this.projetService.getProjectsTypes().subscribe(projets=>
    {
      this.projets = projets;
    });

    this.projetService.getProjects().subscribe(projet=>
      {
        this.projet = projet;
      });


  }

  get creationFormControl() {
    return this.creationForm.controls;
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

  currentStep = 1;
  nextStep() {
    if (this.currentStep < 6) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      if(this.currentStep==4){
        this.formType='project';
      }
      if(this.currentStep==5){
        this.formType='document';
      }
      if(this.currentStep==6){
        this.formType='collaborator';
      }
      this.currentStep--;

    }

  }

  onCancel() {
    this.dialogRef.close();
    window.location.reload();
  }

  saveD=false;
  saveC=false;
  saveS=false;
  project_id:any;
  onSubmit() {
    this.isLoading=true;
    this.submitted = true;
    if (this.formType === 'project' && this.creationForm.valid) {
      if (this.creationForm.valid && this.selectedFile) {
        const formData = new FormData();
        formData.append('titre_projet', this.creationForm.value.title);
        formData.append('descript_projet', this.creationForm.value.summary);
        formData.append('tbl_niveau_id', this.creationForm.value.niveau);
        formData.append('user_id', this.id);
        formData.append('tbl_categorie_id', this.creationForm.value.category);
        formData.append('image', this.selectedFile);
        formData.append('type', this.creationForm.value.type);

        this.projetService.addProject(formData)
          .subscribe({
            next: value => {
              this.projets.push(value); // Ajouter le nouveau projet à la liste locale des projets
              this.creationForm.reset(); // Réinitialiser le formulaire
              console.log(value.id);
              this.project_id=value.id;
              this.isLoading=false;
              alert("votre projet a ete creer avec succes");
            },
            error: err => {
              console.log(err);
              this.isLoading=false;

              this.ErrorMessage="Erreur l'ors de la creation rassurez vous d'avoir bien remplir les champs du formulaire";
            },
            complete: () => {

              this.isLoading=false;
              //this.dialogRef.close(this.creationForm.value);
              this.formType='document';
              this.currentStep++;
              //window.location.reload();
              this.submitted=false;

            }
          });
          console.log(this.creationForm.value)
      }
      else {
        console.error('Form is invalid or image not selected');
      }
    }
    if (this.formType === 'document' && this.documentForm.valid) {
      // this.isLoading=true;
      // this.submitted = true;
      if (this.documentForm.valid && this.selectedFile) {
        const formData = new FormData();
        formData.append('nom_doc', this.documentForm.value.title);
        formData.append('user_id', this.id);
        formData.append('tbl_projet_id', this.project_id);
        formData.append('document', this.selectedFileD);

        this.documentService.addDocument(formData).subscribe({
            next: value => {
              console.log(value);
              alert("votre document a ete creer avec succes");
              this.isLoading=false;
            },
            error: err => {
              console.log(err);
              alert("erreur l'ors de la creation");
              this.isLoading=false;
             // this.formType='collaborator';
            },
            complete: () => {
              //this.dialogRef.close(this.documentForm.value);
              //window.location.reload();
              this.isLoading=false;
              this.documentForm.reset();
              //this.formType='collaborator';
              //this.currentStep++;
              this.saveD=true;
            }
          });
      }
       else
          console.error('Form is invalid or image not selected');

      }
     if (this.formType === 'collaborator' && this.collaboratorForm.valid) {
        //this.isLoading=true;
        this.colService.addCollaborateur(this.collaboratorForm.value.name, this.collaboratorForm.value.email, this.project_id, this.user_id).subscribe({
        next: value => {
          alert("collaborateur ajouter avec succes");
          this.isLoading=false;
        },
        error: err=>{
          console.log(err);
          alert("erreur l'ors de l'ajout");
          this.isLoading=false;
          //this.formType='supervisor';
        },
        complete: ()=>{
          //this.dialogRef.close(this.collaboratorForm.value);
          //window.location.reload();
          this.isLoading=false;
          this.collaboratorForm.reset();
          //this.formType='supervisor';
          //this.currentStep++;
          this.saveC=true;
        }
      });
    }
    if (this.formType === 'supervisor' && this.supervisorForm.valid) {
      //this.isLoading=true;
      this.supService.addSuperviseur(this.supervisorForm.value.name, this.supervisorForm.value.email).subscribe({
        next: value => {
          alert("superviseur ajouter avec succes");
          this.isLoading=false;
        },
        error: err=>{
          console.log(err);
          alert("erreur l'ors de l'ajout");
          this.isLoading=false;

        },
        complete: ()=>{
          //this.dialogRef.close(this.supervisorForm.value);
          this.isLoading=false;
          this.saveS=true;
          this.supervisorForm.reset();
          //

        }
      });
    }

  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.creationForm.patchValue({
        file: this.selectedFile.name
      });
    }
  }

  selectedFileD:any;
  onFileSelectedD(event: any) {
    this.selectedFileD = event.target.files[0];
    if (this.selectedFileD) {
      this.documentForm.patchValue({
        file: this.selectedFileD.name
      });
    }
  }
}
