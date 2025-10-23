import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from '../../services/announcement.service';
import { LocalCommunityService } from '../../services/localcommunity.service';
import { UserService } from '../../services/user.service'; // Dodaj import
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement-add',
  templateUrl: './announcement-add.component.html',
  styleUrls: ['./announcement-add.component.css'],
})
export class AnnouncementAddComponent implements OnInit {
  announcementForm!: FormGroup;
  selectedFile?: File;
  previewUrl?: string;

  isSidebarOpen: boolean = false;
  localCommunities: LocalCommunity[] = [];
  isLoading: boolean = true; // Dodaj loading indicator

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private localCommunityService: LocalCommunityService,
    private userService: UserService, // Dodaj UserService
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Inicijalizacija forme
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      publishedAt: [new Date().toISOString().split('T')[0], Validators.required],
      expirationDate: ['', Validators.required],
      isImportant: [false], 
      localCommunityId: [{ value: null, disabled: true }, Validators.required], // Disabled dok se ne učita
      picture: [null]
    });

    this.loadLocalCommunities();
    this.loadCurrentUser();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onFileSelected(event: any) {
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

  loadLocalCommunities() {
    this.localCommunityService.getAll().subscribe({
      next: (communities) => {
        this.localCommunities = communities;
      },
      error: (err) => console.error('Greška pri učitavanju mesnih zajednica:', err)
    });
  }

  loadCurrentUser() {
    this.userService.getCurrentUserFromApi().subscribe({
      next: (currentUser) => {
        this.isLoading = false;
        
        if (currentUser && currentUser.localCommunityId) {
          // Admin ima mesnu zajednicu - postavi je u formu
          this.announcementForm.patchValue({
            localCommunityId: currentUser.localCommunityId
          });
        } else {
          // Admin nema mesnu zajednicu - prikaži upozorenje i vrati na listu
          Swal.fire({
            icon: 'warning',
            title: 'Pažnja!',
            text: 'Morate biti dodeljen mesnoj zajednici pre nego što dodate obaveštenje.',
            confirmButtonText: 'U redu'
          }).then(() => {
            this.router.navigate(['/announcement']);
          });
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Greška pri učitavanju korisnika:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri učitavanju podataka.',
          confirmButtonText: 'U redu'
        }).then(() => {
          this.router.navigate(['/announcement']);
        });
      }
    });
  }

  submit() {
    if (this.announcementForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Greška',
        text: 'Molimo popunite sva obavezna polja.',
        confirmButtonText: 'U redu'
      });
      return;
    }

    const formValues = this.announcementForm.getRawValue(); // Koristi getRawValue() da uzmeš i disabled polja
    
    const formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('publishedAt', formValues.publishedAt);
    formData.append('expirationDate', formValues.expirationDate);
    formData.append('isImportant', formValues.isImportant.toString());
    
    const adminId = this.authService.getId();
    if (adminId) {
      formData.append('adminId', adminId.toString());
    }
    
    if (formValues.localCommunityId) {
      formData.append('localCommunityId', formValues.localCommunityId.toString());
    }

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.announcementService.createAnnouncement(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Obaveštenje uspešno dodato.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/announcement']);
      },
      error: (err) => {
        console.error('Greška pri dodavanju:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri dodavanju obaveštenja.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/announcement']);
  }
}