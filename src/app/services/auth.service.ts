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
        console.log(response.accessToken)
      })
    );
  }

  logout() {
    this.userService.logout();
    localStorage.removeItem('jwt');
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getRole(): string | null {
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  try {
    // Split token: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return null;

    // Base64 decode
    const decodedPayload = JSON.parse(atob(payload));

    const roleClaim = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";
    return decodedPayload[roleClaim] || null;

  } catch (e) {
    console.error('Greška pri dekodiranju tokena', e);
    return null;
  }
}

getId(): string | null {
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

getUsername(): string | null {
  const token = localStorage.getItem('jwt');
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload["username"] || null;

  } catch (e) {
    console.error('Greška pri dekodiranju tokena', e);
    return null;
  }
}

}

function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}

