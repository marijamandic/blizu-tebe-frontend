import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {

  profileForm!: FormGroup;
  userId!: number;
  selectedFile?: File;
  previewUrl?: string;
  existingPictureName?: string;

  isSidebarOpen = false;
  localCommunities: LocalCommunity[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private localCommunityService: LocalCommunityService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      username: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      profilePicture: [null],
      localCommunityId: [null]
    });

    this.loadLocalCommunities();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = Number(idParam);
      this.loadUser(this.userId);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadLocalCommunities() {
    this.localCommunityService.getAll().subscribe({
      next: (communities) => this.localCommunities = communities,
      error: err => console.error('Greška pri učitavanju mesnih zajednica:', err)
    });
  }

  loadUser(id: number) {
    this.userService.getById(id).subscribe({
      next: user => {
        this.profileForm.patchValue({
          name: user.name,
          surname: user.surname,
          username: user.username,
          dateOfBirth: new Date(user.dateOfBirth).toISOString().split('T')[0],
          localCommunityId: user.localCommunityId || null
        });

        this.existingPictureName = user.profilePicture;
        if (user.profilePicture) {
          this.previewUrl = user.profilePicture.includes('/images/profiles/')
            ? user.profilePicture.replace('/images/profiles/', '/images/users/')
            : user.profilePicture;
        }
      },
      error: err => console.error('Greška pri učitavanju korisnika:', err)
    });
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submit() {
    if (this.profileForm.invalid) {
      console.error('Forma nije validna');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.profileForm.value.name);
    formData.append('surname', this.profileForm.value.surname);
    formData.append('username', this.profileForm.value.username);
    formData.append('dateOfBirth', this.profileForm.value.dateOfBirth);

    if (this.profileForm.value.localCommunityId) {
      formData.append('localCommunityId', this.profileForm.value.localCommunityId);
    }

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    } else if (this.existingPictureName) {
      formData.append('profilPicture', this.existingPictureName);
    }

    this.userService.updateUser(this.userId, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Profil uspešno izmenjen.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/view-user', this.userId]);
      },
      error: err => console.error('Greška pri izmeni profila:', err)
    });
  }

  cancel() {
    this.router.navigate(['/view-user', this.userId]);
  }
}