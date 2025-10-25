import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-all-users',
  templateUrl: './view-all-users.component.html',
  styleUrls: ['./view-all-users.component.css'],
})
export class ViewAllUsersComponent implements OnInit {

  users: User[] = [];
  isSidebarOpen = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.isAdmin) {
      this.router.navigate(['/']);
      return;
    }
    this.fetchAllUsers();
  }

 fetchAllUsers(): void {
  this.userService.getCurrentUserFromApi().subscribe({
    next: (currentUser) => {
      if (!currentUser) {
        console.error('Trenutni korisnik nije učitan');
        return;
      }

      this.userService.getAll().subscribe({
        next: (data) => {
          this.users = data.filter(u => 
            u.role !== 0 && u.localCommunityId === currentUser.localCommunityId
          );
        },
        error: (err) => console.error('Error fetching users', err)
      });
    },
    error: (err) => console.error('Error fetching current user', err)
  });
}




  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getImageUrl(fileName: string): string {
    if (fileName) {
      return `https://localhost:44375/images/users/${fileName}`;
    }
    return 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  setDefaultImage(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  viewUser(id: number): void {
    this.router.navigate(['/view-user', id]);
  }

  approveUser(user: User): void {
    if (user.isVerified) return;

    this.userService.verifyUser(user.id).subscribe({
      next: () => {
        user.isVerified = true;
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: `Korisnik ${user.username} je odobren.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: err => console.error('Error approving user', err)
    });
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }
}