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
  credentials: Credentials = {
    username: '',
    password: ''
  };

  constructor(private authService: AuthService,
              private router: Router,
              private userService: UserService
  ){}

  ngOnInit(){

  }

  onLogin(){
    this.authService.login(this.credentials).subscribe({
      next: result => {
        console.log("token: ", result.accessToken);

        this.userService.getById(result.id).subscribe({
          next: res => {
            res.dateOfBirth = new Date(res.dateOfBirth); 
            this.userService.setCurrentUser(res);
            console.log("logged user: ", res);
          },
          error: err => {
            console.error("Error fetching user: ", err);
          }
        });

        this.router.navigate(['/home']);
      },
      error: err => {
        console.error('Login failed', err);
      }
    })
  }

}
