import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityRequestUsersService } from 'src/app/services/community-request-user.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.html',
  styleUrls: ['./participants.css'],
})
export class ParticipantsComponent implements OnInit {

  participants: any[] = [];
  requestId!: number;
  requestTitle = '';
  isSidebarOpen = false;
  isFulfilled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private communityRequestUserService: CommunityRequestUsersService
  ) {}

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.requestTitle = this.route.snapshot.queryParamMap.get('title') || '';
    this.isFulfilled = this.route.snapshot.queryParamMap.get('fulfilled') === 'true';

    this.fetchParticipants();
  }

  fetchParticipants(): void {
  this.communityRequestUserService.getByRequestId(this.requestId).subscribe({
    next: (data) => {
      this.participants = data;

      this.participants.forEach((p, index) => {
        this.userService.getById(p.userId).subscribe({
          next: (user) => {
            this.participants[index].user = user;
          },
          error: (err) => console.error(`Greška pri učitavanju korisnika ${p.userId}`, err)
        });
      });
    },
    error: (err) => console.error('Greška pri učitavanju učesnika', err)
  });
}


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getImageUrl(fileName: string): string {
    return fileName
      ? `https://localhost:44375/images/users/${fileName}`
      : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  setDefaultImage(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  viewUser(id: number): void {
    this.router.navigate(['/view-user', id]);
  }

  rateUser(user: User): void {
    this.router.navigate(['/rate-user', user.id], {
      queryParams: { requestId: this.requestId }
    });
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }
}
