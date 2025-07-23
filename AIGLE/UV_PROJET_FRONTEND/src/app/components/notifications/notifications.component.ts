import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  loading = true;

  constructor(private notificationService: NotificationService) {}


  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  markAsRead(id: number) {
    this.notificationService.markNotificationAsRead(id).subscribe(() => {
      this.loadNotifications();
    });
  }
}

@NgModule({
  imports: [CommonModule],
  declarations: [NotificationsComponent],
  exports: [NotificationsComponent]
})
export class NotificationsModule {}
