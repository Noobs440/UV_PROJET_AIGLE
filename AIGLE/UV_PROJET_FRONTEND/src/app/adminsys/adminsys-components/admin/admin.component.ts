import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjetService } from '../../../services/projet.service';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  projects: any[] = [];
  notifications: any[] = [];
  token!: string;
  name!: string;
  role!: string;
  id: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private projetService: ProjetService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getAllProjects();
    this.loadNotifications();
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.name = params['name'];
      this.role = params['role'];
      this.id = params['id'];
    });
  }
  @ViewChild('toggleSidebarBtn', { static: true }) toggleSidebarBtn!: ElementRef;
  @ViewChild('body', { static: true }) sidebar!: ElementRef;

  toggleSidebar(): void {
    this.sidebar.nativeElement.classList.toggle('toggle-sidebar');
  }

  getAllProjects(): void {
    this.projetService.getProjects().subscribe(projets => {
      this.projects = projets;
    });
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

  deconnexion(): void {
    const result = confirm('Voulez-vous vous déconnecter?');
    if (result) {
      this.userService.logout().subscribe({
        next: value => {
          console.log(value);
          alert('Déconnexion effectuée');
        },
        error: err => {
          console.log(err);
        },
        complete: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/home']);
          console.log("Déconnexion réussie");
        }
      });
    }
  }

  getProjectQueryParams(project: any): any {
    return {
      title: project.titre_projet,
      status: project.status,
      image: project.image,
      description: project.descript_projet,
      views: project.views,
      author: project.nom_utilisateur,
      category: project.nom_categorie,
      level: project.niveau,
      type: project.type,
      date: project.created_at,
      email: project.email
    };
  }

  updateProjectStatus(projectId: number, newStatus: string): void {
    this.projetService.updateProjectStatus(projectId, newStatus).subscribe(() => {
      this.getAllProjects(); // Actualiser la liste des projets après la mise à jour
    });
  }


}
