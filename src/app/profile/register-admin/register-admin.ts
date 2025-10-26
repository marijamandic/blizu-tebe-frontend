import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-admin',
  templateUrl: './register-admin.html',
  styleUrls: ['./register-admin.css'],
})
export class RegisterAdmin implements OnInit {
  registerForm!: FormGroup;
  localCommunities: LocalCommunity[] = [];
  selectedFile?: File;
  previewUrl?: string;
  errorMessage = '';
  isSidebarOpen = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localCommunityService: LocalCommunityService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, this.adultValidator]],
      localCommunityId: [null, Validators.required],
      picture: [null]
    });

    this.loadLocalCommunities();
  }

  loadLocalCommunities(): void {
    this.localCommunityService.getAll().subscribe({
      next: (communities) => {
        this.localCommunities = communities;
      },
      error: (err) => console.error('Greška pri učitavanju mesnih zajednica:', err)
    });
  }

  adultValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  const today = new Date();
  const birthDate = new Date(control.value);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18 ? null : { underage: true };
}

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

 


  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Popunite sva obavezna polja';
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.value.username);
    formData.append('password', this.registerForm.value.password);
    formData.append('name', this.registerForm.value.name);
    formData.append('surname', this.registerForm.value.surname);
    formData.append('dateOfBirth', this.registerForm.value.dateOfBirth);

    if (this.registerForm.value.localCommunityId) {
      formData.append('localCommunityId', this.registerForm.value.localCommunityId);
    }

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.userService.registerAdmin(formData).subscribe({
      next: () => {
        Swal.fire({
      icon: 'success',
      title: 'Uspešno!',
      text: 'Uspešna registracija.',
      timer: 4000,
      showConfirmButton: false
    });
        this.ngOnInit()
      },
      error: (err) => {
        this.errorMessage = 'Greška pri registraciji: ' + (err.error?.message || 'Pokušajte ponovo');
        console.error('Greška:', err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }



}

