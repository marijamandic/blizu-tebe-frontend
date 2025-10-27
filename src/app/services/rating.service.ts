import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rating } from '../model/rating.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = environment.apiHost + 'rating'; 

  constructor(private http: HttpClient) {}

  createRating(rating: Rating): Observable<Rating> {
    return this.http.post<Rating>(`${this.apiUrl}`, rating);
  }

  updateRating(id: number, rating: Rating): Observable<Rating> {
    return this.http.put<Rating>(`${this.apiUrl}/${id}`, rating);
  }

  getAllRatings(): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}`);
  }


  deleteRating(id: number): Observable<Rating> {
    return this.http.delete<Rating>(`${this.apiUrl}/${id}`);
  }

  getRatingById(id: number): Observable<Rating> {
    return this.http.get<Rating>(`${this.apiUrl}/getById/${id}`);
  }

  getRatingsByRaterId(raterId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/getByRaterId/${raterId}`);
  }

  getRatingsByRatedId(ratedId: number): Observable<Rating[]> {
    return this.http.get<Rating[]>(`${this.apiUrl}/getByRatedId/${ratedId}`);
  }
}
