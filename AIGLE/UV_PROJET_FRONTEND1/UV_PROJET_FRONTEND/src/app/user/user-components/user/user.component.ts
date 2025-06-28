
import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { ProjetService } from '../../../services/projet.service';
import { ListingService } from '../../../services/listing.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  constructor(private ProjectByIdService:ListingService, private projetService:ProjetService, private route:ActivatedRoute, private router:Router, private userService: UserService ,private renderer: Renderer2, private el: ElementRef,private notificationService:NotificationService) {}

  token!:string;
  user_name!:string;
   photo: string = 'assets/img/default.png'; // image par défaut
  role!:string;
  id:any;
   user: any = {}; // Stocke les infos utilisateur
  notifications: any[] =[];
  projects:any[]=[];
isProjectsCollapsed: boolean = true;
   projectsMenuOpen: boolean = false;
     toggleProjectsMenu(): void {
    this.projectsMenuOpen = !this.projectsMenuOpen;
  }

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUserProfilePhoto();
    this.route.queryParams.subscribe(params => {
      this.token=params['token'];
      this.user_name=params['name'];
      this.role=params['role'];
      this.id=params['id']
    });

    this.notificationService.getNotifications().subscribe(
      notification => {
        this.notifications = notification;
        console.log(this.notifications);
      });


      this.ProjectByIdService.getProjectsById(this.id).subscribe({
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

      this.getProjectQueryParams(this.projects)
  }
 loadUserProfilePhoto(): void {
    this.userService.getUserProfile().subscribe({
      next: (userData) => {
        if (userData.photo) {
          this.photo = userData.photo.startsWith('http')
            ? userData.photo
            : `http://localhost:8000/${userData.photo}`;
        } else {
          this.photo = 'assets/img/default.png';
        }
      },
      error: (err) => {
        console.error('Erreur chargement photo:', err);
        this.photo = 'assets/img/default.png';
      }
    });
  }


  getProjectQueryParams(project: any): any {
    return {
      id: project.id,
      user_id: project.user_id,
      title: project.titre,
      status: project.status,
      image: project.image,
      description: project.description,
      views: project.views,
      author: project.nom_utilisateur,
      category: project.nom_categorie,
      level: project.niveau,
      type: project.type,
      date: project.created_at,
      email: project.email
    };
  }

  @ViewChild('toggleSidebarBtn', { static: true }) toggleSidebarBtn!: ElementRef;
  @ViewChild('body', { static: true }) sidebar!: ElementRef;

  toggleSidebar(): void {
    this.sidebar.nativeElement.classList.toggle('toggle-sidebar');
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  markNotificationAsRead(notificationId: number): void {
    this.notificationService.markNotificationAsRead(notificationId).subscribe(() => {
      console.log('Notification marked as read successfully.');
      this.loadNotifications();
    });
  }



  markAllNotificationAsRead(): void {
    this.notificationService.markAllNotificationAsRead().subscribe(() => {
      console.log('All notifications marked as read successfully.');
      this.loadNotifications();
    });
  }


get photoUrl(): string {
    if (!this.user.photo) {
      return 'assets/img/default.png'; // image par défaut locale
    }
    // Retourne l'URL complète si c'est une URL, sinon construit le chemin complet
    if (this.user.photo.startsWith('http')) {
      return this.user.photo;
    }
    return `http://localhost:8000/${this.user.photo}`; // exemple: 'images/nomfichier.jpg'
  }

  deconnexion(){
    const result = confirm('voulez vous vous deconnecter');
    if(result){
    this.userService.logout().subscribe({
      next: value =>{
        console.log(value);
        alert('deconnexion effectuer');
      },
      error: err=>{
        console.log(err);
      },
      complete: ()=>{
        localStorage.removeItem('token');
        this.router.navigate(['/home',]);
        console.log("success")
      }
    });

  }
}


}
