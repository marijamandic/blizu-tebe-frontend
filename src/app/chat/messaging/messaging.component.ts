import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/model/chat.mode';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { HelpRequestService } from 'src/app/services/help-request.service';
import { GiftService } from 'src/app/services/gift.service';
import { PostType } from 'src/app/model/report.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})

export class MessagingComponent  implements OnInit {

  chats: Chat[] = [];
  userId: number = 0;
  isSidebarOpen = false;
  userNames: { [key: number]: string } = {};
  postTitles: { [key: number]: string } = {};

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private userService: UserService,
    private helpRequestService: HelpRequestService,
    private giftService: GiftService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.authService.getId());

    this.loadChats();
  }

loadChats(): void {
  this.chatService.getAllForUser(this.userId).subscribe({
    next: (chats) => {
      this.chats = chats;

      chats.forEach(chat => {
        const otherUserId =
          chat.user1Id === this.userId ? chat.user2Id : chat.user1Id;

        this.userService.getById(otherUserId).subscribe({
          next: (user) => {
            this.userNames[otherUserId] = user.name;
          }
        });

        if (chat.postType === PostType.Gift) {
          this.giftService.getById(chat.postId).subscribe({
            next: (gift) => {
              this.postTitles[chat.postId] = gift.title;
            }
          });
        } else if (chat.postType === PostType.HelpRequest) {
          this.helpRequestService.getById(chat.postId).subscribe({
            next: (request) => {
              this.postTitles[chat.postId] = request.title;
            }
          });
        }
      });
    }
  });
}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openChat(chat: Chat): void {
    this.router.navigate(['/messaging', chat.id]);
  }
}
