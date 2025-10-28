import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityRequest } from 'src/app/model/community-request.model';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommunityRequestService } from 'src/app/services/communtiy-request.service';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-community-request-update.component',
  templateUrl: './community-request-update.component.html',
  styleUrls: ['./community-request-update.component.css'],
})
export class CommunityRequestUpdateComponent implements OnInit {
  requestForm!: FormGroup;
  requestId!: number;
  selectedFile?: File;
  previewUrl?: string;
  existingPictureName?: string;
  errorMessage = '';
  isSidebarOpen = false;
  localCommunities: LocalCommunity[] = [];
  isLoading = true;
  existingRequest?: CommunityRequest;  

  requestTypeMap: { [key: number]: string } = {
    0: 'Donation',
    1: 'Volunteering',
    2: 'Transport'
  }

  constructor(
    private fb: FormBuilder,
    private requestService: CommunityRequestService,
    private localCommunityService: LocalCommunityService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      createdAt: ['', Validators.required],
      requestType: ['', Validators.required],
      fulfilled: [false],
      localCommunityId: [{ value: null, disabled: true }],
      picture: [null]
    });

    this.loadLocalCommunities();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.requestId = Number(idParam);
      this.loadRequest(this.requestId);
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

  loadRequest(id: number) {
    this.requestService.getCommunityRequestById(id).subscribe({
      next: (data) => {
        this.existingRequest = data;
        this.isLoading = false;

        this.requestForm.patchValue({
          title: data.title,
          description: data.description,
          createdAt: data.createdAt? new Date(data.createdAt).toISOString().slice(0, 16): '',
          requestType: this.requestTypeMap[Number(data.requestType)],
          fulfilled: data.fulfilled,
          localCommunityId: data.localCommunityId || null
        });

        this.existingPictureName = data.picture;
        if (data.picture) {
          this.previewUrl = `https://localhost:44375/images/community_requests/${data.picture}`;
        }
      },
      error: (err) => console.error('Greška pri učitavanju zahteva:', err)
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
    formData.append('fulfilled', formValues.fulfilled.toString());

    if (formValues.localCommunityId) {
      formData.append('localCommunityId', formValues.localCommunityId.toString());
    }

    if (this.selectedFile) {
      formData.append('filePicture', this.selectedFile);
    } else if (this.existingPictureName) {
      formData.append('picture', this.existingPictureName);
    }

    this.requestService.updateCommunityRequest(this.requestId, formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Radna akcija uspešno izmenjena.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(['/community-request', this.requestId]);
      },
      error: (err) => {
        console.error('Greška pri izmeni:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri izmeni radne akcije.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  cancel() {
    this.router.navigate(['/community-request']);
  }

  
}
