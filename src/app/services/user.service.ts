import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../model/credentials.model';
import { LoginResponse } from '../model/login-response';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from '../model/user.model';
import { environment } from 'src/env/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setCurrentUser(user: User) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout() {
    this.currentUserSubject.next(null);
  }

  getById(id: number): Observable<User>{
    return this.http.get<User>(environment.apiHost + 'users/getById/' + id);
  }
  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiHost}users`);
  }

  register(formData: FormData): Observable<User> {
    return this.http.post<User>(`${environment.apiHost}users/register`, formData);
  }

  updateUser(id: number, formData: FormData): Observable<User> {
    return this.http.put<User>(`${environment.apiHost}users/${id}`, formData);
  }

  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${environment.apiHost}users/${id}`);
  }

  verifyUser(id: number): Observable<User> {
    return this.http.put<User>(`${environment.apiHost}users/verify/${id}`, null);
  }

  getCurrentUserFromApi(): Observable<User | null> {
  const id = this.getIdFromToken();
  if (!id) {
    return of(null); 
  }

  return this.getById(Number(id));
}

private getIdFromToken(): string | null {
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload["id"] || null;

  } catch (e) {
    console.error('Greška pri dekodiranju tokena', e);
    return null;
  }
}
}