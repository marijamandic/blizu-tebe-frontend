import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {

  user!: User;
  localCommunityName: string = '';
  isSidebarOpen = false;
  isOwnProfile = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private localCommunityService: LocalCommunityService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const loggedUserId = this.authService.getId();
    if(id.toString() === loggedUserId)
    {
      this.isOwnProfile = true;
    }
    if (id) {
      this.loadUser(id);
    }
  }

  loadUser(id: number) {
    this.userService.getById(id).subscribe({
      next: (u) => {
        this.user = u;
        if (u.localCommunityId) {
          this.localCommunityService.getById(u.localCommunityId).subscribe({
            next: (lc) => this.localCommunityName = lc.name,
            error: (err) => console.error('Greška pri učitavanju mesne zajednice', err)
          });
        }
      },
      error: (err) => console.error('Greška pri učitavanju korisnika', err)
    });

    
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onImageError(event: any): void {
    event.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  editProfile(id: number) {
    this.router.navigate(['/edit-user', id]);
  }
}
