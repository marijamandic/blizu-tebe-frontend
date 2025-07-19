import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../model/credentials.model';
import { LoginResponse } from '../model/login-response';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: Credentials): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`http://localhost:8080/api/auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.accessToken);
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}
