import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoginPopupComponent } from '../../home-components/modals/login-popup/login-popup.component';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { ProjetService } from '../../services/projet.service';
import { UserDataService } from '../../services/user-data.service';

@Component({
  selector: 'app-navConn',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css',]
})
export class NavComponentConn {
  @Input() bgColor: string = '';
  status:any;
    projects: any[] = [];
    notifications: any[] = [];
    token!: string;
    name!: string;
    role!: string;
    id: any;
    showNotificationsMenu = false;
    showProfileMenu = false;

  ngOnInit(): void {
    this.loadNotifications();
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.name = params['name'];
      this.role = params['role'];
      this.id = params['id'];
      console.log('name:', this.name);
      console.log('id:', this.id);
    });
    this.userDataService.userData$.subscribe(data => {
      if (data) {
        this.name = data.name;
        this.id = data.id;
        console.log('Nom reçu :', data.name );
        console.log('ID reçu :', data.id );
      }
    });
    this.sendData();

    //this.router.navigate(['/homec/homec/recent-post'], { queryParams: { name: this.name, id:this.id } });
  }
  loadNotifications() {
      this.notificationService.getNotifications().subscribe((notifications: any[]) => {
      this.notifications = notifications;
    });
    //throw new Error('Method not implemented.');
  }

  sendData() {
    this.userDataService.setUserData({ name: this.name, id: this.id });
  }
  constructor(
    private userDataService: UserDataService,
    private route: ActivatedRoute, 
    private translate: TranslateService,
    private dialog:MatDialog, 
    private router: Router,
    private userService: UserService,
    private projetService: ProjetService,
    private notificationService: NotificationService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
  }

  isActive(routeFragment: string): boolean {
    return this.router.url === routeFragment;
  }
 switchLanguage(language: any) {
    this.translate.use(language);
  }

 markNotificationAsRead(notificationId: number): void {
    this.notificationService.markNotificationAsRead(notificationId).subscribe(() => {
      console.log('Notification marked as read successfully.');
      this.loadNotifications();
    });
  }

   markAllNotificationAsRead(this: any): void {
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
  // Ouvre/ferme le menu des notifications
toggleNotificationsMenu(): void {
  this.showNotificationsMenu = !this.showNotificationsMenu;
  // Optionnel : fermer le menu profil si ouvert
  if (this.showNotificationsMenu) {
    this.showProfileMenu = false;
  }
}

// Ouvre/ferme le menu profil
toggleProfileMenu(): void {
  this.showProfileMenu = !this.showProfileMenu;
  // Optionnel : fermer le menu notifications si ouvert
  if (this.showProfileMenu) {
    this.showNotificationsMenu = false;
  }
}
}
