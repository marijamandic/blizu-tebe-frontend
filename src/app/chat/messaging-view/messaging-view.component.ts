import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Chat } from 'src/app/model/chat.mode';
import { Message } from 'src/app/model/message.model';

import { ChatService } from 'src/app/services/chat.service';
import { MessageService } from 'src/app/services/message.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-messaging-view',
  templateUrl: './messaging-view.component.html',
  styleUrls: ['./messaging-view.component.css']
})
export class MessagingViewComponent implements OnInit {

  chatId: number = 0;
  userId: number = 0;

  chat: Chat | null = null;
  messages: Message[] = [];
  newMessage: string = '';

  isSidebarOpen = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    const userId = this.authService.getId();

    if (userId) {
      this.userId = Number(userId);
    }

    this.chatId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadChat();
    this.loadMessages();
  }

  loadChat(): void {
    this.chatService.getById(this.chatId).subscribe({
      next: (chat) => {
        this.chat = chat;
      },
      error: (error) => {
        console.error('Error loading chat:', error);
      }
    });
  }

  loadMessages(): void {
    this.messageService.getAllFromChat(this.chatId).subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (error) => {
        console.error('Error loading messages:', error);
      }
    });
  }

  sendMessage(): void {

    if (!this.newMessage.trim()) {
      return;
    }

    const message: Message = {
      id: 0,
      senderId: this.userId,
      content: this.newMessage.trim(),
      timestamp: new Date(),
      chatId: this.chatId
    };

    this.messageService.create(message).subscribe({
      next: (createdMessage) => {
        this.messages.push(createdMessage);
        this.newMessage = '';
      },
      error: (error) => {
        console.error('Error sending message:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/messaging']);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}