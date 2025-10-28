import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Rating } from 'src/app/model/rating.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityRequestUsersService } from 'src/app/services/community-request-user.service';
import { CommunityRequestService } from 'src/app/services/communtiy-request.service';
import { RatingService } from 'src/app/services/rating.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.html',
  styleUrls: ['./rate.css'],
})
export class RateComponent implements OnInit {
  ratingForm!: FormGroup;
  errorMessage = '';
  isSidebarOpen: boolean = false;
  isLoading: boolean = true;

  ratedUserId!: number;
  ratedUserName: string = '';
  requestId!: number;
  requestTitle: string = '';
  hoveredStar: number = 0;

  constructor(
    private fb: FormBuilder,
    private ratingService: RatingService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private communityRequestService: CommunityRequestService,
    private communityRequestUserService: CommunityRequestUsersService
  ) {}

  ngOnInit(): void {
    this.ratedUserId = Number(this.route.snapshot.paramMap.get('userId'));
    this.requestId = Number(this.route.snapshot.queryParamMap.get('requestId'));

    this.ratingForm = this.fb.group({
      score: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['']
    });

    this.loadRatedUser();
    this.loadCommunityRequest();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadRatedUser() {
    this.userService.getById(this.ratedUserId).subscribe({
      next: (user) => {
        this.ratedUserName = `${user.name} ${user.surname}`;
        this.checkIfLoaded();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Greška pri učitavanju korisnika:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Nije moguće učitati podatke o korisniku.',
          confirmButtonText: 'U redu'
        }).then(() => this.router.navigate(['/']));
      }
    });
  }

  loadCommunityRequest() {
    this.communityRequestService.getCommunityRequestById(this.requestId).subscribe({
      next: (request) => {
        this.requestTitle = request.title;
        this.checkIfLoaded();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Greška pri učitavanju radne akcije:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Nije moguće učitati podatke o radnoj akciji.',
          confirmButtonText: 'U redu'
        }).then(() => this.router.navigate(['/']));
      }
    });
  }

  checkIfLoaded() {
    if (this.ratedUserName && this.requestTitle) {
      this.isLoading = false;
    }
  }

  setRating(star: number) {
    this.ratingForm.patchValue({ score: star });
  }

  onStarHover(star: number) {
    this.hoveredStar = star;
  }

  onStarLeave() {
    this.hoveredStar = 0;
  }

  getStarClass(star: number): string {
    const currentScore = this.ratingForm.get('score')?.value || 0;
    const displayScore = this.hoveredStar || currentScore;
    return star <= displayScore ? 'star filled' : 'star';
  }

  submit() {
    Object.keys(this.ratingForm.controls).forEach(field => {
      const el = document.getElementById(field);
      if (el) el.classList.remove('input-error');
    });

    if (this.ratingForm.invalid) {
      Object.keys(this.ratingForm.controls).forEach(field => {
        const control = this.ratingForm.get(field);
        if (control && control.invalid) {
          const el = document.getElementById(field);
          if (el) el.classList.add('input-error');
        }
      });
      this.errorMessage = 'Molimo vas da odaberete ocenu (1-5 zvezdica)';
      return;
    }

    this.errorMessage = '';
    const formValues = this.ratingForm.value;

    const raterId = this.authService.getId();
    if (!raterId) {
      this.errorMessage = 'Greška: Niste prijavljeni.';
      return;
    }

    const rating: any = {
      score: formValues.score,
      comment: formValues.comment || undefined,
      timeStamp: new Date(),
      raterId: Number(raterId),
      ratedId: this.ratedUserId
    };

    this.ratingService.createRating(rating).subscribe({
      next: () => {
        this.communityRequestUserService.deleteCommunityRequestUser(this.ratedUserId, this.requestId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Uspešno!',
              text: 'Ocena uspešno dodata.',
              timer: 2000,
              showConfirmButton: false
            });
            this.router.navigate(['/community-request-participants', this.requestId], {
              queryParams: { 
                title: this.requestTitle,
                fulfilled: true 
              }
            });
          },
          error: (err) => {
            console.error('Greška pri brisanju veze:', err);
            this.router.navigate(['/community-request-participants', this.requestId], {
              queryParams: { 
                title: this.requestTitle,
                fulfilled: true 
              }
            });
          }
        });
      },
      error: (err) => {
        console.error('Greška pri dodavanju ocene:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri dodavanju ocene.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/community-request-participants', this.requestId], {
      queryParams: { 
        title: this.requestTitle,
        fulfilled: true 
      }
    });
  }
}