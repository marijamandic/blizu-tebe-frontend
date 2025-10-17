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
  token = localStorage.getItem('jwt');

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(this.apiUrl);
  }

 getAnnouncementById(id: number): Observable<Announcement> {
  return this.http.get<Announcement>(`${this.apiUrl}/getById/${id}`);
}

createAnnouncement(formData: FormData): Observable<Announcement> {
    return this.http.post<Announcement>(this.apiUrl, formData);
  }

  updateAnnouncement(id: number, formData: FormData): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/${id}`, formData);
  }

  deleteAnnouncement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
