import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-all-local-community',
  templateUrl: './view-all-local-community.component.html',
  styleUrls: ['./view-all-local-community.component.css'],
})
export class ViewAllLocalCommunityComponent implements OnInit {
  communities: LocalCommunity[] = [];
  isSidebarOpen = false;

  constructor(private service: LocalCommunityService) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadCommunities(): void {
    this.service.getAll().subscribe({
      next: (data) => this.communities = data,
      error: (err) => console.error('Greška pri učitavanju:', err)
    });
  }

  removeCommunity(id: number | undefined): void {
  if (!id) return;

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
      this.service.deleteLocalCommunity(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Obrisano!',
            text: 'Mesna zajednica je uspešno obrisana.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadCommunities(); // osveži listu
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Greška!',
            text: 'Došlo je do greške prilikom brisanja mesne zajednice.'
          });
          console.error('Greška pri brisanju:', err);
        }
      });
    }
  });
}
}
