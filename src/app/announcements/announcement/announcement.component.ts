import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Announcement } from '../../model/announcement.model';
import { AnnouncementService } from '../../services/announcement.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement',
  templateUrl: 'announcement.component.html',
  styleUrls: ['./announcement.component.css'],
})
export class AnnouncementComponent { 

  announcements: Announcement[] = [];
  importantAnnouncements: Announcement[] = [];
  regularAnnouncements: Announcement[] = [];
  isSidebarOpen = false;

  constructor(
    private announcementService: AnnouncementService, 
    private router: Router, 
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.fetchAllAnnouncements();
  }

  fetchAllAnnouncements(): void {
  this.userService.getCurrentUserFromApi().subscribe(currentUser => {

    this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        let filteredData = data;
        console.log(currentUser)

        if (currentUser) { 
          filteredData = data.filter(a => a.localCommunityId === currentUser.localCommunityId);
        }

        // Podeli na važne i obične
        this.importantAnnouncements = filteredData.filter(a => a.isImportant);
        this.regularAnnouncements = filteredData.filter(a => !a.isImportant);
        this.announcements = filteredData.sort((a, b) => Number(b.isImportant) - Number(a.isImportant));
      },
      error: (err) => console.error('Error fetching announcements', err)
    });

  }, err => console.error('Error fetching current user', err));
}


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getImageUrl(fileName: string): string {
    if (fileName) {
      return `https://localhost:44375/images/announcements/${fileName}`;
    }
    return 'https://blogs.nottingham.ac.uk/learningtechnology/files/2023/04/announcement.jpg';
  }

  setDefaultImage(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://blogs.nottingham.ac.uk/learningtechnology/files/2023/04/announcement.jpg';
  }

  goToAnnouncement(id: number): void {
    this.router.navigate(['/announcement', id]);
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  goToAddAnnouncement(): void {
  this.userService.getCurrentUserFromApi().subscribe({
    next: (currentUser) => {
      if (currentUser && !currentUser.localCommunityId) {
        Swal.fire({
          icon: 'warning',
          title: 'Pažnja!',
          text: 'Morate izabrati mesnu zajednicu pre nego što dodate obaveštenje.',
          confirmButtonText: 'U redu',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/community/all']);
        });
      } else {
        this.router.navigate(['/announcement/add']);
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

}