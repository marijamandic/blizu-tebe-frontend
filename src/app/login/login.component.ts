import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Credentials } from '../model/credentials.model';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: Credentials = { username: '', password: '' };
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  onLogin() {
    this.errorMessage = null;
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: result => {
        console.log('token: ', result.accessToken);

        this.userService.getById(result.id).subscribe({
          next: res => {
            res.dateOfBirth = new Date(res.dateOfBirth);
            this.userService.setCurrentUser(res);
            console.log('logged user: ', res);
            this.router.navigate(['/home']);
          },
          error: err => {
            console.error('Error fetching user: ', err);
            this.errorMessage = 'Greška pri učitavanju korisnika.';
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: err => {
        console.error('Login failed', err);
        this.errorMessage = 'Neispravno korisničko ime ili lozinka.';
        this.loading = false;
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHomePage(){
    this.router.navigate(['/']);
  }
}
