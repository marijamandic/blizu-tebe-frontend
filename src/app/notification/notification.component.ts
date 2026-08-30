import { Component, OnInit } from '@angular/core';
import { NotificationType, Notification, RelatedObjectType } from '../model/notification.model';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  isSidebarOpen = false;
  notifications: Notification[] = [];
  selectedNotification: Notification | null = null;
  isModalOpen = false;
  notificationType = NotificationType;

  constructor(
    private notificationService: NotificationService,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void{
    const userId = this.authService.getId();

    if(userId == null)
      return;

    this.notificationService.getByUser(Number(userId)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
      },
      error: (error) => {
        console.error('Error loaading notifications: ', error);
      }
    });
  }

  openNotification(notification: Notification): void{
    this.selectedNotification = notification;
    this.isModalOpen = true;

    if(!notification.isRead){
      this.notificationService.markAsRead(notification.id).subscribe({
        next: () => {
          notification.isRead = true;
        },
        error: (error) => {
          console.error('Error marking notification as read: ', error);
        }
      });
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedNotification = null;
  }

  getTypeName(type: NotificationType): string {
    switch(type){
      case NotificationType.NewMessage:
        return 'Nova poruka';

      case NotificationType.NewReport:
        return 'Nova prijava';

      case NotificationType.ReportAccepted:
        return 'Prijava prihvaćena';

      case NotificationType.ReportRejected:
        return 'Prijava odbijena';

      default:
        return 'Novost';
    }
  }

  openRelatedObject(notification: Notification): void{
    if(notification.relatedObjectId == null || notification.relatedObjectType == null)
      return;

    switch(notification.relatedObjectType){
      case RelatedObjectType.Message:
        this.messageService.getById(notification.relatedObjectId).subscribe({
          next: (message) => {
            console.log("chat id: ", message.chatId);
            this.router.navigate(['/messaging', message.chatId]);
            this.closeModal();
          },
          error: (error) => {
            console.error('Error loading message: ', error);
          }
        });
        break;

      case RelatedObjectType.Gift:
        this.router.navigate(['/report', notification.relatedObjectId]);
        this.closeModal();
        break;

      case RelatedObjectType.HelpRequest:
        this.router.navigate(['/report', notification.relatedObjectId]);
        this.closeModal();
        break;

    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
