import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

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
    mesneZajednice: boolean = false;
    korisnici: boolean = false;

    @Input() isOpen: boolean = false;
    isAdmin: boolean = false;

    constructor(private router: Router, private authService: AuthService, private userService: UserService) {
      this.isAdmin = this.authService.getRole() === 'Admin';
    }
  

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

  toggleUsers() {
  this.korisnici = !this.korisnici;
}

  toggleCommunities(): void { this.mesneZajednice = !this.mesneZajednice; }

  goToHomePage() {
this.router.navigate(['/home']);
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

  goToMyProfile(): void {
    const id = this.authService.getId();
    if (id) {
      this.router.navigate([`/view-user/${id}`]);
    } else {
      console.error('ID korisnika nije pronađen u JWT tokenu');
    }
  }

  goToMyCommunity(): void {
    const userId = this.authService.getId();
    if (!userId) {
      console.error('Korisnik nije prijavljen.');
      return;
    }

    this.userService.getById(Number(userId)).subscribe({
      next: (user) => {
        const communityId = user.localCommunityId || -1 
        console.log(communityId)
        if (communityId || communityId != -1) {
          this.router.navigate([`/view-community/${communityId}`]);
        } else {
          alert('Korisnik nema dodeljenu mesnu zajednicu.');
        }
      },
      error: (err) => console.error('Greška pri učitavanju korisnika', err)
    });
  }


logOut() {
 this.authService.logout();
}


}
