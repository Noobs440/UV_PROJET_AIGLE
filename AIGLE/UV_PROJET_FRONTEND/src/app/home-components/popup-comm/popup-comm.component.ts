import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; 
import { CommentaireService }from'../../services/commentaire.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-popup-comm',
  templateUrl: './popup-comm.component.html',
  styleUrls: ['./popup-comm.component.css']
})
export class PopupCommComponent implements OnInit{
  
  //@Input()visible:boolean=false;
  //@Output() close = new EventEmitter<void>();

  commentaires: any[] = [];
  userOnline={};
  newComm:string="";
  nameU!: string | null;
  idU!: string | null;

  constructor(
    public dialogRef: MatDialogRef<PopupCommComponent>,
    private com:CommentaireService,
    private route: ActivatedRoute,
    private userDataService: UserDataService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const projetId = this.data.projetId;
    // Récupérer les commentaires du projet au chargement
    this.com.getAllcommentsByprojects(projetId).subscribe((comments: any[]) => {
      this.commentaires = comments;
    });

    this.userDataService.userData$.subscribe(data => {
      if (data) {
        console.log('Nom reçu :', data.name );
        console.log('ID reçu :', data.id );
        this.nameU = data.name;
        this.idU = data.id;
      }
    });
    this.route.queryParams.subscribe(params => {
      if(params['name'] && params['id']){
        this.nameU = params['name'];
        this.idU = params['id'];
      }else{
        this.nameU = null;
        this.idU = null;
      }
      console.log('name:', this.nameU);
      console.log('id:', this.idU);
    });
  }

  addcom() {
    const texte = this.newComm.trim();
    const projetID = this.data.projetId;
    const userID = this.data.userId ;
    const date = new Date().toISOString();

    if (!texte){
      console.log("erreur");
      this.dialogRef.close();
      return ;
    }

    this.com.addComment(projetID, texte, date)
      .subscribe({
        next: response => {
          // Après ajout, recharger la liste des commentaires
          this.com.getAllcommentsByprojects(projetID).subscribe((comments: any[]) => {
            this.commentaires = comments;
          });
          this.newComm = '';
          setTimeout(() => {
            const liste = document.querySelector('.liste');
            //if (liste) liste = liste; //liste.scrollTop = liste.scrollHeight
          }, 50);
          // Optionnel : navigation ou fermeture de la popup
          //this.dialogRef.close({ commentSent: true });
          //this.dialogRef.close();
          //this.router.navigate([`/homec/project-detail/${projetID}`], { queryParams: { name: this.data.name, id: this.data.id } });
        },
        error: err => {
          console.error('Erreur lors de l\'ajout du commentaire :', err);
          alert('Erreur serveur : ' + (err?.error?.message || err.message || 'Erreur inconnue'));
        }
      });
  }
  closep(){
    this.dialogRef.close();
  }
}

