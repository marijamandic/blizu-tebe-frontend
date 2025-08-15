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
}
