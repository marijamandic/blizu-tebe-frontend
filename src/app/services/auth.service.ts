import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../model/credentials.model';
import { LoginResponse } from '../model/login-response';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/env/environment';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  login(credentials: Credentials): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(environment.apiHost + `auth/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.accessToken);
      })
    );
  }

  logout() {
    this.userService.logout();
    localStorage.removeItem('jwt');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
}
