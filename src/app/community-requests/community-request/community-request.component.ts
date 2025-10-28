import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityRequest } from 'src/app/model/community-request.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityRequestService } from 'src/app/services/communtiy-request.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-request',
  templateUrl: './community-request.component.html',
  styleUrls: ['./community-request.component.css'],
})
export class CommunityRequestComponent implements OnInit{

  requests: CommunityRequest[] = [];
  importantRequests: CommunityRequest[] = [];
  regularRequests: CommunityRequest[] = [];
  isSidebarOpen = false;

  constructor(
    private requestService: CommunityRequestService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchAllRequests();
  }

  fetchAllRequests(): void {
    this.userService.getCurrentUserFromApi().subscribe(currentUser => {
      this.requestService.getAllCommunityRequests().subscribe({
        next: (data) => {
          let filteredData = data;

          if (currentUser) {
            filteredData = data.filter(r => r.localCommunityId === currentUser.localCommunityId);
          }

          this.requests = filteredData;
          if (filteredData.length === 0) {
                    Swal.fire({
                      icon: 'info',
                      title: 'Nema radnih akcija',
                      text: 'Trenutno nema nijedna radna akcija za vašu mesnu zajednicu.',
                      confirmButtonText: 'U redu',
                      confirmButtonColor: '#398fb2'
                    });
                  }
        },
        error: (err) => console.error('Error fetching community requests', err)
      });
    }, err => console.error('Error fetching current user', err));
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getImageUrl(fileName: string): string {
    if (fileName) {
      return `https://localhost:44375/images/community_requests/${fileName}`;
    }
    return 'https://europa.rs/wp-content/uploads/2014/09/volontiranje-1.png';
  }

  setDefaultImage(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://europa.rs/wp-content/uploads/2014/09/volontiranje-1.png';
  }

  goToRequest(id: number): void {
    this.router.navigate(['/community-request', id]);
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  goToAddRequest(): void {
    this.userService.getCurrentUserFromApi().subscribe({
      next: (currentUser) => {
        if (currentUser && !currentUser.localCommunityId) {
          Swal.fire({
            icon: 'warning',
            title: 'Pažnja!',
            text: 'Morate izabrati mesnu zajednicu pre nego što dodate zahtev.',
            confirmButtonText: 'U redu',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.router.navigate(['/community/all']);
          });
        } else {
          this.router.navigate(['/community-request/add']);
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
    });
  }

  adjustOneHourBack(date: Date): Date {
  const d = new Date(date);
  d.setHours(d.getHours() - 1);
  return d;
}

}
