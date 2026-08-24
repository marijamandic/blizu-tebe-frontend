import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/environment';
import { Gift, GiftCategory } from '../model/gift.model';
import { PagedResult } from '../model/paged-result.model';

@Injectable({
  providedIn: 'root'
})
export class GiftService {

  private apiUrl = `${environment.apiHost}Gift`;

  constructor(private http: HttpClient) { }

  getAll(page: number, size: number, category?: GiftCategory): Observable<PagedResult<Gift>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if(category !== undefined){
        params = params.set('category', category);
    }

    return this.http.get<PagedResult<Gift>>(this.apiUrl, {params});
  }

  getPending(page: number, size: number, category?: GiftCategory): Observable<PagedResult<Gift>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if(category !== undefined){
        params = params.set('category', category);
    }

    return this.http.get<PagedResult<Gift>>(this.apiUrl + '/pending', {params});
  }

  getCompleted(page: number, size: number, category?: GiftCategory): Observable<PagedResult<Gift>> {
    let params = new HttpParams().set('page', page).set('size', size);

    if(category !== undefined){
        params = params.set('category', category);
    }
    
    return this.http.get<PagedResult<Gift>>(this.apiUrl + '/completed', {params});
  }

  getById(id: number): Observable<Gift> {
    return this.http.get<Gift>(`${this.apiUrl}/${id}`);
  }

  create(request: any): Observable<Gift> {
    return this.http.post<Gift>(this.apiUrl, request);
  }

  update(formData: FormData): Observable<Gift> {
    return this.http.put<Gift>(this.apiUrl, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}