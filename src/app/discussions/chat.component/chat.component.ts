import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { DiscussionComment } from 'src/app/model/discussion-comment.model';
import { Discussion } from 'src/app/model/discussion.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DiscussionCommentService } from 'src/app/services/discussion-comment.service';
import { DiscussionService } from 'src/app/services/discussion.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-chat.component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  discussionId!: number;
  comments: (DiscussionComment & { user?: User })[] = [];
  newMessage = '';
  currentUser!: User;
  isSidebarOpen = false;
  currentDiscussion!: Discussion;
  selectedComment: DiscussionComment | null = null;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private commentService: DiscussionCommentService,
    private authService: AuthService,
    private userService: UserService,
    private discussionService: DiscussionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.discussionId = Number(this.route.snapshot.paramMap.get('id'));

    const userId = this.authService.getId();
    if (userId) {
      this.userService.getById(Number(userId)).subscribe(user => {
        this.currentUser = user;
        this.loadDiscussion();
        this.loadComments();
      });
    }
  }

   loadDiscussion(): void {
    this.discussionService.getDiscussionById(this.discussionId).subscribe({
      next: (disc) => (this.currentDiscussion = disc),
      error: (err) => console.error('Greška pri učitavanju diskusije:', err)
    });
  }

 loadComments(): void {
  this.commentService
    .getCommentsByDiscussionId(this.discussionId)
    .pipe(
      switchMap((comments) => {
        if (!comments.length) return of([]);

        const userIds = [...new Set(comments.map((c) => c.userId))];
        const requests = userIds.map((id) => this.userService.getById(id));

        return forkJoin(requests).pipe(
          map((users) => {
            const userMap = new Map(users.map((u) => [u.id, u]));
            return comments
              .sort(
                (a, b) =>
                  new Date(a.commentedAt).getTime() - new Date(b.commentedAt).getTime()
              )
              .map((c) => ({
                ...c,
                user: userMap.get(c.userId)
              }));
          })
        );
      })
    )
    .subscribe({
      next: (data) => {
        this.comments = data;
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Greška pri učitavanju komentara:', err)
    });
}


  sendMessage(): void {
    if (!this.newMessage.trim() || !this.currentUser) return;

    const newComment: DiscussionComment = {
      id: 0,
      text: this.newMessage.trim(),
      commentedAt: new Date(),
      userId: this.currentUser.id,
      discussionId: this.discussionId
    };

    this.commentService.createDiscussionComment(newComment).subscribe({
      next: (created) => {
        this.comments.push(created);
        this.newMessage = '';
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => console.error('Greška pri slanju poruke:', err)
    });
  }

  scrollToBottom(): void {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goBack(): void {
  this.router.navigate(['/discussion']); 
}

selectMessage(comment: DiscussionComment): void {
    if (this.selectedComment?.id === comment.id) {
      this.selectedComment = null;
    } else {
      this.selectedComment = comment;
    }
  }

  editMessage(comment: DiscussionComment): void {
    Swal.fire({
      title: 'Izmenite poruku',
      input: 'text',
      inputValue: comment.text,
      showCancelButton: true,
      confirmButtonText: 'Sačuvajte',
      cancelButtonText: 'Otkažite',
      inputValidator: (value) => {
        if (!value) return 'Poruka ne može biti prazna!';
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedComment = { ...comment, text: result.value };

        this.commentService.updateDiscussionComment(comment.id, updatedComment).subscribe({
          next: (res) => {
            comment.text = res.text;
            Swal.fire('Uspeh!', 'Poruka je izmenjena.', 'success');
          },
          error: () => Swal.fire('Greška', 'Došlo je do greške pri izmeni.', 'error')
        });
      }
    });
  }

  deleteMessage(comment: DiscussionComment): void {
    Swal.fire({
      title: 'Da li sigurno želiš da obrišeš poruku?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Obrišite',
      cancelButtonText: 'Otkažite'
    }).then((result) => {
      if (result.isConfirmed) {
        this.commentService.deleteDiscussionComment(comment.id).subscribe({
          next: () => {
            this.comments = this.comments.filter(c => c.id !== comment.id);
            Swal.fire('Obrisano!', 'Poruka je uspešno obrisana.', 'success');
          },
          error: () => Swal.fire('Greška', 'Nije moguće obrisati poruku.', 'error')
        });
      }
    });
  }
}
