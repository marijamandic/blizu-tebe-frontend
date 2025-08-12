import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Announcement } from '../model/announcement.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = environment.apiHost + 'announcement';

  constructor(private http: HttpClient) { }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

}
