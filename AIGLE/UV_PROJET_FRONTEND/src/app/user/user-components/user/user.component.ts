import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { NotificationService } from '../../../services/notification.service';
import { UserService } from '../../../services/user.service';
import { ProjetService } from '../../../services/projet.service';
import { ListingService } from '../../../services/listing.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  animations: [
    trigger('fadeOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0, height: 0, margin: 0, padding: 0 })),
      transition('in => out', [animate('300ms ease-in')])
    ])
  ]
})
export class UserComponent implements OnInit {
  token!: string;
  user_name!: string;
  role!: string;
  id: any;

  photo: string = 'assets/img/default.png';

  notifications: any[] = [];
  dismissedNotificationIds: number[] = [];

  projects: any[] = [];
  filteredProjects: any[] = [];
  searchQuery: string = '';
  selectedTypeFilter: string = 'all';
  availableTypes: string[] = ['Projet', 'Mémoire', 'Article'];

  refreshInterval: any;

  // Gestion des alertes personnalisées (déclarées au niveau de la classe pour accès template)
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'info' = 'info';
  showAlert: boolean = false;

  @ViewChild('toggleSidebarBtn', { static: true }) toggleSidebarBtn!: ElementRef;
  @ViewChild('body', { static: true }) sidebar!: ElementRef;

  constructor(
    private projectByIdService: ListingService,
    private projetService: ProjetService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.user_name = params['name'];
      this.role = params['role'];
      this.id = params['id'];

      if (this.id) this.loadProjects();

      this.userService.loadUserProfile();
      this.userService.getUserProfile().subscribe({
        next: (userData) => {
          this.photo = userData?.photo?.startsWith('http')
            ? userData.photo
            : `http://localhost:8000/${userData?.photo}` || 'assets/img/default.png';
        },
        error: () => {
          this.photo = 'assets/img/default.png';
        }
      });
    });

    this.loadNotifications();

    // 🔄 Rafraîchissement automatique toutes les 20 secondes
    this.refreshInterval = setInterval(() => {
      this.loadNotifications();
    }, 20000); // 20 secondes
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  loadProjects(): void {
    this.projectByIdService.getProjectsById(this.id).subscribe({
      next: (data) => {
        this.projects = data ?? [];
        this.applyCombinedFilter();
      },
      error: (err) => {
        console.error('Erreur chargement projets:', err);
        this.projects = [];
        this.filteredProjects = [];
      }
    });
  }

  applyCombinedFilter(): void {
    const query = this.searchQuery.toLowerCase().trim();
    const selectedType = this.selectedTypeFilter.toLowerCase();

    this.filteredProjects = this.projects.filter(project => {
      const titre = (project.titre ?? '').toLowerCase();
      const type = (project.type ?? '').toLowerCase();

      const matchesSearch = titre.includes(query) || type.includes(query);
      const matchesType = selectedType === 'all' || type === selectedType;

      return matchesSearch && matchesType;
    });
  }

  filterProjects(): void {
    this.applyCombinedFilter();
  }

  filterByType(type: string): void {
    this.selectedTypeFilter = type && type.trim() !== '' ? type : 'all';
    this.applyCombinedFilter();
  }

  clearTypeFilter(): void {
    this.selectedTypeFilter = 'all';
    this.applyCombinedFilter();
  }

  toggleSidebar(): void {
    this.sidebar.nativeElement.classList.toggle('toggle-sidebar');
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = notifications ?? [];
      },
      error: () => {
        this.notifications = [];
      }
    });
  }

  markNotificationAsRead(notificationId: number): void {
    this.dismissedNotificationIds.push(notificationId);
    setTimeout(() => {
      this.notificationService.markNotificationAsRead(notificationId).subscribe(() => {
        this.loadNotifications();
        this.dismissedNotificationIds = this.dismissedNotificationIds.filter(id => id !== notificationId);
      });
    }, 300); // attendre la fin de l'animation
  }

  markAllNotificationAsRead(): void {
    this.notificationService.markAllNotificationAsRead().subscribe(() => {
      this.loadNotifications();
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

  deconnexion(): void {
    const result = confirm('Voulez-vous vous déconnecter ?');
    if (result) {
      this.userService.logout().subscribe({
        next: () => {
          this.alertType = 'success';
          this.alertMessage = 'Déconnexion effectuée';
          this.showAlert = true;
        },
        error: err => console.log(err),
        complete: () => {
          localStorage.removeItem('token');
          this.router.navigate(['/home']);
        }
      });
    }
  }
}
