import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityRequest, RequestType } from 'src/app/model/community-request.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityRequestService } from 'src/app/services/communtiy-request.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-request-view.component',
  templateUrl: './community-request-view.component.html',
  styleUrls: ['./community-request-view.component.css'],
})
export class CommunityRequestViewComponent implements OnInit {

  request!: CommunityRequest;
  isSidebarOpen = false;

  constructor(
    private route: ActivatedRoute,
    private requestService: CommunityRequestService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadRequest(id);
  }

  loadRequest(id: number) {
    this.requestService.getCommunityRequestById(id).subscribe({
      next: req => this.request = req,
      error: err => console.error('Greška pri učitavanju zahteva', err)
    });
  }

  toggleSidebar(): void {
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

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  editRequest(id: number) {
    this.router.navigate(['/community-request/edit', id]);
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
    }).then(result => {
      if (result.isConfirmed) {
        this.requestService.deleteCommunityRequest(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Obrisano!',
              text: 'Zahtev je uspešno obrisan.',
              timer: 2000,
              showConfirmButton: false
            });
            this.router.navigate(['/community-request']);
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Greška!',
              text: 'Došlo je do greške prilikom brisanja zahteva.'
            });
          }
        });
      }
    });
  }

  translateRequestType(type: any): string {
  switch(type) {
    case 0:
    case 'Donation': return 'Donacija';
    case 1:
    case 'Volunteering': return 'Volontiranje';
    case 2:
    case 'Transport': return 'Transport';
    default: return type;
  }
}


}

