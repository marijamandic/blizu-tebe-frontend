import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

    usluge: boolean =  false;
    pomoci: boolean =  false;
    pokloni: boolean =  false;
    radneAkcije: boolean =  false;

    @Input() isOpen: boolean = false;

    constructor(private router: Router, private authService: AuthService) {}
  

  toggleUsluge(): void {
    this.usluge = !this.usluge;
  }

  togglePomoci(): void {
    this.pomoci = !this.pomoci;
  }

  togglePoklone(): void {
    this.pokloni = !this.pokloni;
  }

  toggleAkcije(): void {
    this.radneAkcije = !this.radneAkcije;
  }

  goToHomePage() {
this.router.navigate(['/home']);
}

logOut() {
 this.authService.logout();
}


}
