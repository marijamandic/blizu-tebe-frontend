import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home-logged',
  templateUrl: './home-logged.component.html',
  styleUrls: ['./home-logged.component.css'],
})
export class HomeLoggedComponent implements OnInit{



  isModal1Open: boolean = false;
  isModal2Open: boolean = false;
  isModal3Open: boolean = false;
  isModal4Open: boolean = false;
  isModalAccountOpen = false;
  userId: number = -1;
  myCommunityName: string | null = null;

  isAdmin = false;

  constructor(private authService: AuthService, private router: Router, private userService: UserService, private communityService: LocalCommunityService) {
    this.checkRole();
  }
  ngOnInit(): void {
    const userId = this.authService.getId();
  if (!userId) {
    console.error('Korisnik nije prijavljen.');
    return;
  }

  this.userService.getById(Number(userId)).subscribe({
    next: (user) => {
      const communityId = user.localCommunityId;

      if (communityId) {
        this.communityService.getById(communityId).subscribe({
          next: (community) => {
            this.myCommunityName = community.name;
          },
          error: (err) => console.error('Greška pri učitavanju mesne zajednice:', err)
        });
      } else {
        this.myCommunityName = 'Nema dodeljenu mesnu zajednicu';
      }
    },
    error: (err) => console.error('Greška pri učitavanju korisnika:', err)
  });
  }

  checkRole() {
    this.isAdmin = this.authService.getRole() === 'Admin'
    this.userId = Number(this.authService.getId())
  }

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

toggleAccountModal() { this.isModalAccountOpen = !this.isModalAccountOpen; }

logOut() {
 this.authService.logout();
}

goToAnnouncement() {
this.router.navigate(['/announcement']);
}

 goToMyProfile() {
    this.router.navigate([`/view-user/${this.userId}`]);
  }

  goToAllUsers() {
    this.router.navigate(['/view-all-users']);
  }

  handleAccountClick() {
    if (this.isAdmin) {
      this.toggleAccountModal();
    } else {
      this.goToMyProfile();
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


  
}

