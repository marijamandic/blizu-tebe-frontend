import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpRequest } from 'src/app/model/help-request.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { HelpRequestService } from 'src/app/services/help-request.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-help-request-view',
  templateUrl: './help-request-view.component.html',
  styleUrls: ['./help-request-view.component.css']
})
export class HelpRequestViewComponent implements OnInit{

  helpRequest!: HelpRequest;
  isSidebarOpen = false;
  user: User | null = null;
  owner: User | null = null;
  isRequest = false;

  constructor(
    private route: ActivatedRoute,
    private helpRequestService: HelpRequestService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    this.isRequest = !this.router.url.toLowerCase().includes('helpoffer');

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
    if(id){
      this.loadHelpRequest(id);
    }
  }

  loadHelpRequest(id: number){
    
    this.helpRequestService.getById(id).subscribe({
      next: (request) => {
        this.helpRequest = request;
        this.userService.getById(this.helpRequest.userId).subscribe({
          next: (owner) => {
            this.owner = owner;
          },
          error: (err) => {
            console.error(err);
          }
        });
      },
      error: (err) => console.error('Greška pri učitavanju objave', err)
    });
  }

  loadUser() {
    const id = this.authService.getId();

    this.userService.getById(Number(id)).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/pictures/help-placeholder.png';
  }

  get isAdminOrOwner(): boolean {
    const role = this.authService.getRole();
    const userId = Number(this.authService.getId());

    if (!this.helpRequest || !userId) return false;

    return role === 'Admin' || userId === this.helpRequest.userId;
  }


  goBack() {
    this.router.navigate([
      this.isRequest ? '/helpRequests' : '/helpOffers'
    ]);
  }

  editRequest(id: number){
    if(this.isRequest)
      this.router.navigate(['/helpRequest/edit', id]);
    else
      this.router.navigate(['/helpOffer/edit', id]);
  }


 deleteRequest(id: number) {
    Swal.fire({
      title: 'Da li ste sigurni?',
      text: 'Ova akcija je nepovratna!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#852e2e',
      cancelButtonColor: '#398fb2',
      confirmButtonText: 'Obrišite',
      cancelButtonText: 'Otkažite'
    }).then((result) => {
      if (result.isConfirmed) {
        this.helpRequestService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Obrisano!',
              text: 'Objava je uspešno obrisana.',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Greška!',
              text: 'Došlo je do greške prilikom brisanja objave.'
            });
          }
        });
      }
    });
  }
}
