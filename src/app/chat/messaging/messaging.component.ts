import { Component, OnInit } from '@angular/core';
import { Chat } from 'src/app/model/chat.mode';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chats',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})

export class MessagingComponent  implements OnInit {

  chats: Chat[] = [];
  userId: number = 0;
  isSidebarOpen = false;

  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.authService.getId());

    this.loadChats();
  }

  loadChats(): void {
    this.chatService.getAllForUser(this.userId).subscribe({
      next: (chats) => {
        this.chats = chats;
      },
      error: (error) => {
        console.error('Error loading chats:', error);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
