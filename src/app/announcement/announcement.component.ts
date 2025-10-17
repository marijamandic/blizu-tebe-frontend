import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Announcement } from '../model/announcement.model';
import { AnnouncementService } from '../services/announcement.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-announcement',
  templateUrl: 'announcement.component.html',
  styleUrls: ['./announcement.component.css'],
})
export class AnnouncementComponent { 

  announcements: Announcement[] = [];
  isSidebarOpen = false;

  constructor(private announcementService: AnnouncementService, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.fetchAllAnnouncements();
  }

  fetchAllAnnouncements(): void {
    this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        console.log(data)
        this.announcements = data;
      },
      error: (err) => console.error('Error fetching announcements', err)
    });
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

  goToAddAnnouncement() : void {
    this.router.navigate(['/announcement/add']);
  }

  


}
