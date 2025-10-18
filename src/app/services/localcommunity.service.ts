import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalCommunity } from '../model/localcommunity.model';

@Injectable({
  providedIn: 'root'
})
export class LocalCommunityService {
  private apiUrl = 'https://localhost:44375/api/localcommunity';

  constructor(private http: HttpClient) {}

  getAll(): Observable<LocalCommunity[]> {
    return this.http.get<LocalCommunity[]>(this.apiUrl);
  }

  create(community: LocalCommunity): Observable<LocalCommunity> {
    return this.http.post<LocalCommunity>(this.apiUrl, community);
  }

  getByLocation(lat: number, lng: number): Observable<LocalCommunity> {
    return this.http.get<LocalCommunity>(`${this.apiUrl}/by-location?lat=${lat}&lng=${lng}`);
  }

  deleteLocalCommunity(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`);
}
}