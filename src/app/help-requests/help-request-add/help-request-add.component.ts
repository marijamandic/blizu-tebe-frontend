import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { HelpCategory } from 'src/app/model/help-request.model';
import { AuthService } from 'src/app/services/auth.service';
import { HelpRequestService } from 'src/app/services/help-request.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-help-request-add',
  templateUrl: './help-request-add.component.html',
  styleUrls: ['./help-request-add.component.css']
})
export class HelpRequestAddComponent implements OnInit{
  requestForm!: FormGroup;
  selectedFile?: File;
  previewUrl?: string;
  errorMessage = '';

  isSidebarOpen: boolean = false;
  isLoading: boolean = true;
  isDropdownOpen = false;
  selectedCategory: HelpCategory | null = null;
  HelpCategory = HelpCategory;

  constructor(
    private fb: FormBuilder,
    private helpRequestService: HelpRequestService,
    private userService: UserService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.requestForm = this.fb.group({
      title: ['', Validators.required],
        description: ['', Validators.required],
        postDate: [new Date().toISOString().split('T')[0], Validators.required],
        expireDate: ['', Validators.required],
        contact: ['', Validators.required],
        category: ['', Validators.required],
        attachment: [null]
    });

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
            text: 'Morate biti dodeljen mesnoj zajednici pre nego što dodate oglas.',
            confirmButtonText: 'U redu'
          }).then(() => {
            this.router.navigate(['/helpRequests']);
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
          this.router.navigate(['/helpRequests']);
        });
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

    const dto = {
      title: formValues.title,
      description: formValues.description,
      category: formValues.category,
      contact: formValues.contact,
      postDate: formValues.postDate,
      expireDate: formValues.expireDate,
      adminId: this.authService.getId(),
      localCommunityId: formValues.localCommunityId,
      attachment: this.selectedFile ? this.selectedFile.name : null
    };

    console.log(dto);
    console.log(typeof dto.category);
    console.log(dto.category);
    this.helpRequestService.create(dto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Zahtev uspešno dodat.'
        });

        this.router.navigate(['/helpRequests']);
      },
      error: (err) => {
        console.log(err.error);
        console.log(err.error.errors);
        console.log('STATUS:', err.status);
        console.log('MESSAGE:', err.message);

        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri dodavanju zahteva.',
          confirmButtonText: 'U redu'
        });
      }
    })
  }

  cancel() {
    this.router.navigate(['/helpRequests']);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  categoryLabels: Record<HelpCategory, string> = {
    [HelpCategory.OldPeopleHelp]: 'Pomoć starijima',
    [HelpCategory.HouseKeeping]: 'Kućni poslovi',
    [HelpCategory.PetCare]: 'Briga o ljubimcima',
    [HelpCategory.SmallRepairs]: 'Sitne popravke',
    [HelpCategory.StudyHelp]: 'Pomoć oko učenja',
    [HelpCategory.ThingsExchange]: 'Razmena stvari',
    [HelpCategory.PhysicalWork]: 'Fizički rad',
    [HelpCategory.Socializing]: 'Druženje'
  };

  selectCategory(category: HelpCategory) {
    this.selectedCategory = category;
    this.requestForm.patchValue({
      category: category
    });
    this.isDropdownOpen = false;
  }
}
