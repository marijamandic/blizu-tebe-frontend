import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnnouncementService } from '../../services/announcement.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private announcementService: AnnouncementService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      publishedAt: [new Date().toISOString().split('T')[0], Validators.required],
      expirationDate: ['', Validators.required],
      picture: [null] // Slika nije obavezna
    });
    
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

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.announcementService.createAnnouncement(formData).subscribe({
      next: () => {
        console.log('Obaveštenje uspešno dodato');
        this.router.navigate(['/announcement']);
      },
      error: err => console.error('Greška pri dodavanju:', err)
    });
  }

  cancel() {
    this.router.navigate(['/announcement']);
  }
}
