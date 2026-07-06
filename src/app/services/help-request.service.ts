import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { HelpRequest } from '../model/help-request.model';

@Injectable({
  providedIn: 'root'
})
export class HelpRequestService {

  private apiUrl = `${environment.apiHost}HelpRequest`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>(this.apiUrl);
  }

  getPendingRequests(): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>(this.apiUrl + '/pending-requests');
  }

  getPendingOffers(): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>(this.apiUrl + '/pending-offers');
  }

  getById(id: number): Observable<HelpRequest> {
    return this.http.get<HelpRequest>(`${this.apiUrl}/${id}`);
  }

  create(request: any): Observable<HelpRequest> {
    return this.http.post<HelpRequest>(this.apiUrl, request);
  }

  update(id: number, request: any): Observable<HelpRequest> {
    return this.http.put<HelpRequest>(
      `${this.apiUrl}/${id}`,
      request
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}