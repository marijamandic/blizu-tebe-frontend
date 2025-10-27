import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { CommunityRequest } from '../model/community-request.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityRequestService {
  private apiUrl = environment.apiHost + 'communityRequest';
  token = localStorage.getItem('jwt');

  constructor(private http: HttpClient) {}

  getAllCommunityRequests(): Observable<CommunityRequest[]> {
    return this.http.get<CommunityRequest[]>(this.apiUrl);
  }

  getCommunityRequestById(id: number): Observable<CommunityRequest> {
    return this.http.get<CommunityRequest>(`${this.apiUrl}/getById/${id}`);
  }

  createCommunityRequest(formData: FormData): Observable<CommunityRequest> {
    return this.http.post<CommunityRequest>(this.apiUrl, formData);
  }

  updateCommunityRequest(id: number, formData: FormData): Observable<CommunityRequest> {
    return this.http.put<CommunityRequest>(`${this.apiUrl}/${id}`, formData);
  }

  deleteCommunityRequest(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
