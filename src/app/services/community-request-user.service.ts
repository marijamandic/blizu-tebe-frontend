import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { CommunityRequestUser } from '../model/community-request-user.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityRequestUsersService {
  private apiUrl = environment.apiHost + 'communityRequestUsers';

  constructor(private http: HttpClient) {}

  getAllCommunityRequestUsers(): Observable<CommunityRequestUser[]> {
    return this.http.get<CommunityRequestUser[]>(this.apiUrl);
  }

  getByUserId(userId: number): Observable<CommunityRequestUser[]> {
    return this.http.get<CommunityRequestUser[]>(`${this.apiUrl}/getByUserId/${userId}`);
  }

  getByRequestId(requestId: number): Observable<CommunityRequestUser[]> {
    return this.http.get<CommunityRequestUser[]>(`${this.apiUrl}/getByRequestId/${requestId}`);
  }

  createCommunityRequestUser(user: CommunityRequestUser): Observable<CommunityRequestUser> {
    return this.http.post<CommunityRequestUser>(this.apiUrl, user);
  }

  deleteCommunityRequestUser(userId: number, requestId: number): Observable<CommunityRequestUser> {
    return this.http.delete<CommunityRequestUser>(`${this.apiUrl}/${userId}/${requestId}`);
  }
}
