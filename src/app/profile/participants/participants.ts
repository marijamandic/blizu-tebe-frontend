import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityRequestUsersService } from 'src/app/services/community-request-user.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

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
      if (!data || data.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Nema podataka',
          text: 'Nema više neocenjenih učesnika za ovu radnu akciju.',
          confirmButtonText: 'U redu',
          confirmButtonColor: '#398fb2'
        }).then(() => {
          this.router.navigate(['/community-request', this.requestId]); 
        });
        return;
      }

      this.participants = data;
      console.log(this.participants)

      this.participants.forEach((p, index) => {
        this.userService.getById(p.userId).subscribe({
          next: (user) => {
            this.participants[index].user = user;
          },
          error: (err) =>
            console.error(`Greška pri učitavanju korisnika ${p.userId}`, err),
        });
      });
    },
    error: (err) => {
      console.error('Greška pri učitavanju učesnika', err);
      Swal.fire({
        icon: 'error',
        title: 'Greška',
        text: 'Došlo je do problema pri učitavanju učesnika.',
        confirmButtonText: 'U redu',
        confirmButtonColor: '#6c63ff'
      });
    },
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
    this.router.navigate(['/rate', user.id], {
      queryParams: { requestId: this.requestId }
    });
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  goBack(): void {
  this.router.navigate(['/community-request', this.requestId]); // ili router.navigateByUrl('/')
}
}
