import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Discussion } from '../model/discussion.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {
  private apiUrl = environment.apiHost + 'discussion'; 

  constructor(private http: HttpClient) {}

  createDiscussion(discussion: Discussion): Observable<Discussion> {
    return this.http.post<Discussion>(`${this.apiUrl}`, discussion);
  }

  updateDiscussion(id: number, discussion: Discussion): Observable<Discussion> {
    return this.http.put<Discussion>(`${this.apiUrl}/${id}`, discussion);
  }

  getAllDiscussions(): Observable<Discussion[]> {
    return this.http.get<Discussion[]>(`${this.apiUrl}`);
  }

  deleteDiscussion(id: number): Observable<Discussion> {
    return this.http.delete<Discussion>(`${this.apiUrl}/${id}`);
  }

  getDiscussionById(id: number): Observable<Discussion> {
    return this.http.get<Discussion>(`${this.apiUrl}/getById/${id}`);
  }
}
