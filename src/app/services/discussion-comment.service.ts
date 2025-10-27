import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DiscussionComment } from '../model/discussion-comment.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class DiscussionCommentService {
  private apiUrl = environment.apiHost + 'discussionComment';

  constructor(private http: HttpClient) {}

  createDiscussionComment(comment: DiscussionComment): Observable<DiscussionComment> {
    return this.http.post<DiscussionComment>(`${this.apiUrl}`, comment);
  }

  updateDiscussionComment(id: number, comment: DiscussionComment): Observable<DiscussionComment> {
    return this.http.put<DiscussionComment>(`${this.apiUrl}/${id}`, comment);
  }

  getAllDiscussionComments(): Observable<DiscussionComment[]> {
    return this.http.get<DiscussionComment[]>(`${this.apiUrl}`);
  }


  deleteDiscussionComment(id: number): Observable<DiscussionComment> {
    return this.http.delete<DiscussionComment>(`${this.apiUrl}/${id}`);
  }

  getDiscussionCommentById(id: number): Observable<DiscussionComment> {
    return this.http.get<DiscussionComment>(`${this.apiUrl}/getById/${id}`);
  }

  getCommentsByDiscussionId(discussionId: number): Observable<DiscussionComment[]> {
    return this.http.get<DiscussionComment[]>(`${this.apiUrl}/getByDiscussionId/${discussionId}`);
  }
}
