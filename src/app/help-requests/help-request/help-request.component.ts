import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelpRequest } from '../../model/help-request.model';
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
  defaultImage = 'assets/pictures/help-placeholder.png'

  constructor(
    private helpRequestService: HelpRequestService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.helpRequestService.getPendingRequests().subscribe({
      next: (response) => {
        console.log("RESPONSE:", response);
        this.requests = response;
      },
      error: (err) => {
        console.error('Greška pri učitavanju zahteva:', err);
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
            this.router.navigate(['/helpRequest/all']);
          });
        } else{
          this.router.navigate(['/helpRequest/add']);
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
    this.router.navigate(['/help-requests', id]);
  }

  setDefaultImage(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = this.defaultImage;
  }

}