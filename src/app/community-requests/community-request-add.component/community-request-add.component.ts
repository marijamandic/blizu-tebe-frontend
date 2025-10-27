import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestType } from 'src/app/model/community-request.model';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityRequestService } from 'src/app/services/communtiy-request.service';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-request-add.component',
  templateUrl: './community-request-add.component.html',
  styleUrls: ['./community-request-add.component.css'],
})
export class CommunityRequestAddComponent implements OnInit {
  requestForm!: FormGroup;
  selectedFile?: File;
  previewUrl?: string;
  errorMessage = '';

  isSidebarOpen: boolean = false;
  localCommunities: LocalCommunity[] = [];
  isLoading: boolean = true;

  requestTypes = Object.values(RequestType);

  constructor(
    private fb: FormBuilder,
    private requestService: CommunityRequestService,
    private localCommunityService: LocalCommunityService,
    private userService: UserService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      createdAt: ['', Validators.required],
      requestType: [RequestType.Donation, Validators.required],
      localCommunityId: [{ value: null, disabled: true }, Validators.required],
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
          this.requestForm.patchValue({
            localCommunityId: currentUser.localCommunityId
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Pažnja!',
            text: 'Morate biti dodeljen mesnoj zajednici pre nego što dodate zahtev.',
            confirmButtonText: 'U redu'
          }).then(() => this.router.navigate(['/community-request']));
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
        }).then(() => this.router.navigate(['/community-request']));
      }
    });
  }

  submit() {
    Object.keys(this.requestForm.controls).forEach(field => {
      const el = document.getElementById(field);
      if (el) el.classList.remove('input-error');
    });

    if (this.requestForm.invalid) {
      Object.keys(this.requestForm.controls).forEach(field => {
        const control = this.requestForm.get(field);
        if (control && control.invalid) {
          const el = document.getElementById(field);
          if (el) el.classList.add('input-error');
        }
      });
      this.errorMessage = 'Popunite sva obavezna polja';
      return;
    }

    this.errorMessage = '';
    const formValues = this.requestForm.getRawValue();
    const formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('createdAt', formValues.createdAt);
    formData.append('requestType', formValues.requestType);

    const adminId = this.authService.getId();
    if (adminId) {
      formData.append('adminId', adminId.toString());
    }
    if (formValues.localCommunityId) {
      formData.append('localCommunityId', formValues.localCommunityId.toString());
    }
    if (this.selectedFile) {
      formData.append('filePicture', this.selectedFile);
    }

    this.requestService.createCommunityRequest(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Zahtev uspešno dodat.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/community-request']);
      },
      error: (err) => {
        console.error('Greška pri dodavanju:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri dodavanju zahteva.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/community-request']);
  }
}
