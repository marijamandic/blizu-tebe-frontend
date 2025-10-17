import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Announcement } from '../model/announcement.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnouncementService } from '../services/announcement.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement-view',
  templateUrl: './announcement-view.component.html',
  styleUrls: ['./announcement-view.component.css'],
})
export class AnnouncementViewComponent implements OnInit {


  announcement!: Announcement;
  isSidebarOpen = false;

  constructor(
    private route: ActivatedRoute,
    private announcementService: AnnouncementService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.announcementService.getAnnouncementById(id).subscribe({
        next: (data) => (this.announcement = data),
        error: (err) => console.error('Greška prilikom učitavanja obaveštenja:', err)
      });
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onImageError(event: any): void {
    event.target.src = 'https://blogs.nottingham.ac.uk/learningtechnology/files/2023/04/announcement.jpg';
  }

  get isAdmin(): boolean {
    console.log(this.authService.getRole)
    return this.authService.getRole() === 'Admin';
  }

  editAnnouncement(id: number) {
    this.router.navigate(['/announcement/edit', id]);
  }

 deleteAnnouncement(id: number) {
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
      this.announcementService.deleteAnnouncement(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Obrisano!',
            text: 'Objava je uspešno obrisana.',
            timer: 2000,
            showConfirmButton: false
          });
          // osveži listu objava
          this.router.navigate(['/announcement']);
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
