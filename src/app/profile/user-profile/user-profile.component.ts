import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Rating } from 'src/app/model/rating.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { RatingService } from 'src/app/services/rating.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {

  user!: User;
  localCommunityName: string = '';
  isSidebarOpen = false;
  isOwnProfile = false;
  ratings: { rating: Rating, raterUser: User }[] = [];
  showRatings = false;
  fullInfo: boolean = false;

  canRate = false;
  showRatingModal = false;
  selectedScore = 0;
  ratingComment = '';
  otherUserId = 0;
  commentError = false;
  scoreError = false;


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private localCommunityService: LocalCommunityService,
    private authService: AuthService,
    private router: Router,
    private ratingService: RatingService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const loggedUserId = this.authService.getId();
    if(id.toString() === loggedUserId)
    {
      this.isOwnProfile = true;
      this.fullInfo = true;
    }
    if (id) {
      this.loadUser(id);
      this.loadRatings(id);
    }
    if(this.isAdmin)
    {
      this.fullInfo = true;
    }
  }

  loadUser(id: number) {
    this.userService.getById(id).subscribe({
      next: (u) => {
        this.user = u;
        if (u.localCommunityId) {
          this.localCommunityService.getById(u.localCommunityId).subscribe({
            next: (lc) => this.localCommunityName = lc.name,
            error: (err) => console.error('Greška pri učitavanju mesne zajednice', err)
          });
        }
        if (!this.isOwnProfile && !this.isAdmin) {
          this.ratingService.canRateUser(this.user.id).subscribe({
            next: (canRate) => {
              this.canRate = canRate;
            },
            error: (error) => {
              console.error('Error checking rating:', error);
            }
          });
        }
      },
      error: (err) => console.error('Greška pri učitavanju korisnika', err)
    });
  }

  loadRatings(ratedId: number) {
    this.ratingService.getRatingsByRatedId(ratedId).subscribe({
      next: (ratings) => {
        const userRequests = ratings.map(rating => 
          this.userService.getById(rating.raterId)
        );
        
        if (userRequests.length > 0) {
          forkJoin(userRequests).subscribe({
            next: (users) => {
              this.ratings = ratings.map((rating, index) => ({
                rating: rating,
                raterUser: users[index]
              }));
            },
            error: (err) => console.error('Greška pri učitavanju korisnika koji su ocenili', err)
          });
        }
      },
      error: (err) => console.error('Greška pri učitavanju ocena', err)
    });
  }

  getStarsArray(score: number): number[] {
    return Array(score).fill(0);
  }

  getRoleLabel(role: number): string {
    return role === 0 ? 'Admin' : 'Član';
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onImageError(event: any): void {
    event.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  editProfile(id: number) {
    this.router.navigate(['/edit-user', id]);
  }

  toggleRatings(): void {
  this.showRatings = !this.showRatings;
}

getAge(dateOfBirth: string | Date): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}


  openRating(): void {
    this.showRatingModal = true;
    this.selectedScore = 0;
    this.ratingComment = '';
  }

  closeRating(): void {
    this.showRatingModal = false;
  }

  selectScore(score: number): void {
  this.selectedScore = score;
  this.scoreError = false;
}

  submitRating(): void {
    let hasError = false;

    if (this.selectedScore === 0) {
      this.scoreError = true;
      hasError = true;
    } else {
      this.scoreError = false;
    }

    if (!this.ratingComment.trim()) {
      this.commentError = true;
      hasError = true;
    } else {
      this.commentError = false;
    }

    if (hasError) {
      return;
    }

    const rating: Rating = {
      score: this.selectedScore,
      comment: this.ratingComment.trim() || undefined,
      timeStamp: new Date(),
      raterId: Number(this.authService.getId()),
      ratedId: this.user.id
    };

    this.ratingService.createRating(rating).subscribe({
      next: () => {
        this.showRatingModal = false;
        this.canRate = false;

        this.loadRatings(this.user.id);

        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Ocena je uspešno poslata.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error creating rating:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Greška!',
          text: 'Došlo je do greške prilikom slanja ocene.'
        });
      }
    });
  }

}
