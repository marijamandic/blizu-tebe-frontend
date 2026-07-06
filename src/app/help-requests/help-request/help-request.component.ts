import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpCategory, HelpRequest } from '../../model/help-request.model';
import { HelpRequestService } from '../../services/help-request.service';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-help-requests',
  templateUrl: './help-request.component.html',
  styleUrls: ['./help-request.component.css']
})
export class HelpRequestComponent implements OnInit {

  requests: HelpRequest[] = [];

  isSidebarOpen = false;
  defaultImage = 'assets/pictures/help-placeholder.png';
  mode: 'all' | 'mine' = 'all';
  isRequest = false;

  constructor(
    private helpRequestService: HelpRequestService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.isRequest = !this.router.url.toLowerCase().includes('helpoffer');
    this.mode = this.route.snapshot.data['mode'];

    console.log('is request: ', this.isRequest);
    console.log('mode: ', this.mode);
    if (this.isRequest) {
      this.loadRequests();
    } else {
      this.loadOffers();
    }
  }

  loadRequests(): void {
    this.helpRequestService.getPendingRequests().subscribe({
      next: (response) => {
        const currentUserId = Number(this.authService.getId());

        this.requests = response.filter(x =>
          this.mode === 'all'
            ? true
            : currentUserId !== null && x.userId === currentUserId
        );
      },
      error: (err) => {
        console.error('Greška pri učitavanju zahteva:', err);
      }
    });
  }

  loadOffers(): void {
    this.helpRequestService.getPendingOffers().subscribe({
      next: (response) => {
        const currentUserId = Number(this.authService.getId());

        this.requests = response.filter(x =>
          this.mode === 'all'
            ? true
            : currentUserId !== null && x.userId === currentUserId
        );
      },
      error: (err) => {
        console.error('Greška pri učitavanju ponuda:', err);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goToAddRequest(): void {
    this.userService.getCurrentUserFromApi().subscribe({
      next: (currentUser) => {
        if (currentUser && !currentUser.localCommunityId){
          Swal.fire({
            icon: 'warning',
            title: 'Pažnja!',
            text: 'Morate izabrati mesnu zajednicu pre nego što dodate obaveštenje.',
            confirmButtonText: 'U redu',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            if(this.isRequest)
              this.router.navigate(['/helpRequests']);
            else
              this.router.navigate(['/helpOffers'])
          });
        } else{
          if(this.isRequest)
            this.router.navigate(['/helpRequest/add']);
          else
            this.router.navigate(['/helpOffer/add']);
        }
      },
      error: (err) => {
        console.error('Greška pri proveri korisnika:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška!',
          text: 'Došlo je do greške prilikom učitavanja korisnika.',
          confirmButtonText: 'U redu'
        });
      }
    })
  }

  goToRequest(id: number): void {
    console.log(this.requests);

    if(this.isRequest)
      this.router.navigate(['/helpRequest', id]);
    else
      this.router.navigate(['/helpOffer', id])
  }

  setDefaultImage(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = this.defaultImage;
  }

  categoryLabels: Record<HelpCategory, string> = {
    [HelpCategory.OldPeopleHelp]: 'Pomoć starijima',
    [HelpCategory.HouseKeeping]: 'Kućni poslovi',
    [HelpCategory.PetCare]: 'Briga o ljubimcima',
    [HelpCategory.SmallRepairs]: 'Sitne popravke',
    [HelpCategory.StudyHelp]: 'Pomoć oko učenja',
    [HelpCategory.ThingsExchange]: 'Razmena stvari',
    [HelpCategory.PhysicalWork]: 'Fizički rad',
    [HelpCategory.Socializing]: 'Druženje'
  };

}