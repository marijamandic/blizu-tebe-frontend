import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home-logged',
  templateUrl: './home-logged.component.html',
  styleUrls: ['./home-logged.component.css'],
})
export class HomeLoggedComponent {



  isModal1Open: boolean = false;
  isModal2Open: boolean = false;
  isModal3Open: boolean = false;
  isModal4Open: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleModal1() {
this.isModal1Open = !this.isModal1Open;
} 

toggleModal2() {
this.isModal2Open = !this.isModal2Open;
} 

toggleModal3() {
this.isModal3Open = !this.isModal3Open;
} 

toggleModal4() {
this.isModal4Open = !this.isModal4Open;
} 

logOut() {
 this.authService.logout();
}

goToAnnouncement() {
this.router.navigate(['/announcement']);
}

  
}
