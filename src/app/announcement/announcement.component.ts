import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Announcement } from '../model/announcement.model';
import { AnnouncementService } from '../services/announcement.service';

@Component({
  selector: 'app-announcement',
  templateUrl: 'announcement.component.html',
  styleUrls: ['./announcement.component.css'],
})
export class AnnouncementComponent { 

  announcements: Announcement[] = [];
  isSidebarOpen = false;

  constructor(private announcementService: AnnouncementService) { }

  ngOnInit(): void {
    this.fetchAllAnnouncements();
  }

  fetchAllAnnouncements(): void {
    this.announcementService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
      },
      error: (err) => console.error('Error fetching announcements', err)
    });
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  onImageError(event: Event) {
  const element = event.target as HTMLImageElement;

  // spreči ponovno pokretanje ako i fallback ne uspe
  element.onerror = null;

  // postavi provereni fallback URL
  element.src = 'https://blogs.nottingham.ac.uk/learningtechnology/files/2023/04/announcement.jpg';
}

  


}
