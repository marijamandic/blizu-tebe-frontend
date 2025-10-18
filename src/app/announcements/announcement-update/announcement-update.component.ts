import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from '../../services/announcement.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-announcement-update',
  templateUrl: './announcement-update.component.html',
  styleUrls: ['./announcement-update.component.css'],
})
export class AnnouncementUpdateComponent implements OnInit {
  announcementForm!: FormGroup;
  isEditMode: boolean = false;
  announcementId?: number;
  selectedFile?: File;
  previewUrl?: string;
  existingPictureName?: string; // Čuvamo ime postojeće slike

  isSidebarOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      publishedAt: [new Date().toISOString().split('T')[0], Validators.required],
      expirationDate: ['', Validators.required],
      picture: [null] // Slika NIJE obavezna - može se dodati validation po potrebi
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.announcementId = Number(idParam);
      this.loadAnnouncement(this.announcementId);
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  loadAnnouncement(id: number) {
    this.announcementService.getAnnouncementById(id).subscribe({
      next: data => {
        this.announcementForm.patchValue({
          title: data.title,
          description: data.description,
          publishedAt: new Date(data.publishedAt).toISOString().split('T')[0],
          expirationDate: new Date(data.expirationDate).toISOString().split('T')[0]
        });
        
        // Sačuvaj postojeće ime slike
        this.existingPictureName = data.existingPicture;
        
        if (data.existingPicture) {
          this.previewUrl = 'https://localhost:44375/images/announcements/' + data.existingPicture;
        }
      },
      error: err => console.error('Greška pri učitavanju obaveštenja:', err)
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Preview slike
      const reader = new FileReader();
      reader.onload = e => this.previewUrl = reader.result as string;
      reader.readAsDataURL(this.selectedFile!);
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

    // Dodaj sliku samo ako je selektovana nova
    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    } else if (this.isEditMode && this.existingPictureName) {
      // Ako edit mode i nema nove slike, pošalji staro ime slike
      formData.append('existingPicture', this.existingPictureName);
    }

    if (this.isEditMode && this.announcementId) {
      this.announcementService.updateAnnouncement(this.announcementId, formData).subscribe({
        next: () => {
          console.log('Obaveštenje uspešno izmenjeno');
          this.router.navigate(['/announcement']);
        },
        error: err => console.error('Greška pri izmeni:', err)
      });
    } else {
      this.announcementService.createAnnouncement(formData).subscribe({
        next: () => {
          console.log('Obaveštenje uspešno dodato');
          this.router.navigate(['/announcement']);
        },
        error: err => console.error('Greška pri dodavanju:', err)
      });
    }
  }

  cancel() {
    this.router.navigate(['/announcement']);
  }
}
