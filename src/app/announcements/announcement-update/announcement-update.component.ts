import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from '../../services/announcement.service';
import { LocalCommunityService } from '../../services/localcommunity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement-update',
  templateUrl: './announcement-update.component.html',
  styleUrls: ['./announcement-update.component.css'],
})
export class AnnouncementUpdateComponent implements OnInit {
  announcementForm!: FormGroup;
  announcementId!: number;
  selectedFile?: File;
  previewUrl?: string;
  existingPictureName?: string;
  existingAdminId?: number; // Dodaj za čuvanje adminId

  isSidebarOpen: boolean = false;
  localCommunities: LocalCommunity[] = [];

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private localCommunityService: LocalCommunityService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      publishedAt: ['', Validators.required],
      expirationDate: ['', Validators.required],
      isImportant: [false],
      localCommunityId: [{ value: null, disabled: true }], // Disabled - ne može se menjati
      picture: [null]
    });

    this.loadLocalCommunities();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.announcementId = Number(idParam);
      this.loadAnnouncement(this.announcementId);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadLocalCommunities() {
    this.localCommunityService.getAll().subscribe({
      next: (communities) => {
        this.localCommunities = communities;
      },
      error: (err) => console.error('Greška pri učitavanju mesnih zajednica:', err)
    });
  }

  loadAnnouncement(id: number) {
    this.announcementService.getAnnouncementById(id).subscribe({
      next: data => {
        console.log('Učitano obaveštenje:', data); // Debug log da vidiš šta vraća backend
        
        this.announcementForm.patchValue({
          title: data.title,
          description: data.description,
          publishedAt: new Date(data.publishedAt).toISOString().split('T')[0],
          expirationDate: new Date(data.expirationDate).toISOString().split('T')[0],
          isImportant: data.isImportant || false,
          localCommunityId: data.localCommunityId || null
        });

        this.existingPictureName = data.existingPicture;
        
        this.existingAdminId = data.adminId || data.adminId || -1;
        if (data.existingPicture) {
          this.previewUrl = `https://localhost:44375/images/announcements/${data.existingPicture}`;
        }
      },
      error: err => console.error('Greška pri učitavanju obaveštenja:', err)
    });
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

    const formValues = this.announcementForm.getRawValue(); // Koristi getRawValue() za disabled polja

    const formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('publishedAt', formValues.publishedAt);
    formData.append('expirationDate', formValues.expirationDate);
    formData.append('isImportant', formValues.isImportant.toString());

    // Dodaj adminId - koristi postojeći ili trenutnog korisnika ako ne postoji
    const adminId = this.existingAdminId || this.authService.getId();
    if (adminId) {
      formData.append('adminId', adminId.toString());
      console.log('Šaljem adminId:', adminId); // Debug log
    } else {
      console.warn('adminId nije pronađen!'); // Warning ako nema adminId
    }

    if (formValues.localCommunityId) {
      formData.append('localCommunityId', formValues.localCommunityId.toString());
    }

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    } else if (this.existingPictureName) {
      formData.append('existingPicture', this.existingPictureName);
    }

    this.announcementService.updateAnnouncement(this.announcementId, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Obaveštenje uspešno izmenjeno.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/announcement']);
      },
      error: err => {
        console.error('Greška pri izmeni:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri izmeni obaveštenja.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/announcement']);
  }
}