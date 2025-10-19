import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { User } from 'src/app/model/user.model';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-all-local-community',
  templateUrl: './view-all-local-community.component.html',
  styleUrls: ['./view-all-local-community.component.css'],
})
export class ViewAllLocalCommunityComponent implements OnInit {
  communities: LocalCommunity[] = [];
  isSidebarOpen = false;
  currentUser: User | null = null;

  constructor(private service: LocalCommunityService, private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getCurrentUserFromApi().subscribe(user => {
    this.currentUser = user;
  });
  this.loadCommunities();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadCommunities(): void {
    this.service.getAll().subscribe({
      next: (data) => this.communities = data,
      error: (err) => console.error('Greška pri učitavanju:', err)
    });
  }

  removeCommunity(id: number | undefined): void {
  if (!id) return;

  Swal.fire({
    title: 'Da li ste sigurni?',
    text: 'Ova akcija je nepovratna!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#852e2e',
    cancelButtonColor: '#398fb2',
    confirmButtonText: 'Obrišite',
    cancelButtonText: 'Otkažite'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.deleteLocalCommunity(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Obrisano!',
            text: 'Mesna zajednica je uspešno obrisana.',
            timer: 2000,
            showConfirmButton: false
          });
          this.loadCommunities(); // osveži listu
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Greška!',
            text: 'Došlo je do greške prilikom brisanja mesne zajednice.'
          });
          console.error('Greška pri brisanju:', err);
        }
      });
    }
  });
}

joinCommunity(communityId: number | undefined): void {
  if (!communityId) return;

  if (!this.currentUser) {
    Swal.fire({
      icon: 'error',
      title: 'Greška',
      text: 'Ne možete se pridružiti bez ulogovanog korisnika.'
    });
    return;
  }

  Swal.fire({
    title: 'Potvrdite',
    text: 'Da li želite da se pridružite ovoj mesnoj zajednici?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#398fb2',
    cancelButtonColor: '#852e2e',
    confirmButtonText: 'Pridruži se',
    cancelButtonText: 'Otkaži'
  }).then((result) => {
    if (result.isConfirmed) {

      const id = this.currentUser?.id || -1
      this.userService.updateUser(id, this.buildFormDataForUser(this.currentUser!, communityId))
        .subscribe({
          next: (user) => {
            Swal.fire({
              icon: 'success',
              title: 'Uspešno',
              text: 'Sada ste pridruženi ovoj mesnoj zajednici.',
              timer: 2000,
              showConfirmButton: false
            });
            this.currentUser = user; // osveži lokalnog korisnika
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Greška',
              text: 'Došlo je do greške prilikom pridruživanja.'
            });
            console.error('Greška pri pridruživanju:', err);
          }
        });
    }
  });
}

private buildFormDataForUser(user: User, communityId?: number, profilePictureFile?: File): FormData {
  const formData = new FormData();
  formData.append('id', user.id.toString());
  formData.append('username', user.username);
  formData.append('name', user.name);
  formData.append('surname', user.surname);
  formData.append('role', user.role.toString());
  const dob = user.dateOfBirth instanceof Date ? user.dateOfBirth : new Date(user.dateOfBirth);
  formData.append('dateOfBirth', dob.toISOString());
  formData.append('isVerified', user.isVerified.toString());
  formData.append('localCommunityId', communityId?.toString() || '');
  formData.append('rating', user.rating.toString());

  if (profilePictureFile) {
    formData.append('picture', profilePictureFile);
  }

  return formData;
}



}
