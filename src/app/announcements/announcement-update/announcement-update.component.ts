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
      localCommunityId: [null],
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
        this.announcementForm.patchValue({
          title: data.title,
          description: data.description,
          publishedAt: new Date(data.publishedAt).toISOString().split('T')[0],
          expirationDate: new Date(data.expirationDate).toISOString().split('T')[0],
          isImportant: data.isImportant || false,
          localCommunityId: data.localCommuntyId || null
        });

        this.existingPictureName = data.existingPicture;

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
      console.error('Forma nije validna');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.announcementForm.value.title);
    formData.append('description', this.announcementForm.value.description);
    formData.append('publishedAt', this.announcementForm.value.publishedAt);
    formData.append('expirationDate', this.announcementForm.value.expirationDate);
    formData.append('isImportant', this.announcementForm.value.isImportant);

    if (this.announcementForm.value.localCommunityId) {
      formData.append('localCommunityId', this.announcementForm.value.localCommunityId);
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
      error: err => console.error('Greška pri izmeni:', err)
    });
  }

  cancel() {
    this.router.navigate(['/announcement']);
  }
}