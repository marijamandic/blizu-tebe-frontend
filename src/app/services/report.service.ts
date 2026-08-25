import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { PagedResult } from '../model/paged-result.model';
import { ReportUpdate } from '../model/report-update.model';
import { Report } from '../model/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = `${environment.apiHost}Report`;

  constructor(private http: HttpClient) { }

  getPending(page: number, size: number): Observable<PagedResult<Report>> {
    let params = new HttpParams().set('page', page).set('size', size);

    return this.http.get<PagedResult<Report>>(this.apiUrl, {params});
  }

  getById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}`);
  }

  create(request: any): Observable<Report> {
    return this.http.post<Report>(this.apiUrl, request);
  }

  update(report: ReportUpdate): Observable<Report> {
    return this.http.put<Report>(this.apiUrl, report);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}