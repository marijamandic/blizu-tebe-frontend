import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Gift, GiftCategory } from 'src/app/model/gift.model';
import { AuthService } from 'src/app/services/auth.service';
import { GiftService } from 'src/app/services/gift.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gift-add',
  templateUrl: './gift-add.component.html',
  styleUrls: ['./gift-add.component.css']
})
export class GiftAddComponent implements OnInit {

  giftForm!: FormGroup;

  selectedFile?: File;
  previewUrl?: string;
  errorMessage = '';

  isSidebarOpen = false;
  isDropdownOpen = false;

  selectedCategory: GiftCategory | null = null;

  GiftCategory = GiftCategory;

  isEditMode = false;
  giftId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private giftService: GiftService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit(): void {

    this.giftForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      postDate: [new Date().toISOString().split('T')[0], Validators.required],
      expireDate: ['', Validators.required],
      contact: ['', Validators.required],
      giftCategory: [null, Validators.required],
      attachment: [null]
    });

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.giftId = Number(id);
      this.isEditMode = true;
      this.loadGift(this.giftId);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onFileSelected(event: Event): void {
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

  submit(): void {

    // Ukloni prethodne error klase
    Object.keys(this.giftForm.controls).forEach(field => {
      const element = document.getElementById(field);

      if (element) {
        element.classList.remove('input-error');
      }
    });

    // Validacija
    if (this.giftForm.invalid) {

      Object.keys(this.giftForm.controls).forEach(field => {
        const control = this.giftForm.get(field);

        if (control && control.invalid) {
          const element = document.getElementById(field);

          if (element) {
            element.classList.add('input-error');
          }
        }
      });

      this.errorMessage = 'Popunite sva obavezna polja';
      return;
    }

    this.errorMessage = '';

    const formValues = this.giftForm.getRawValue();

    const userId = this.authService.getId();

    if (userId == null) {
      this.errorMessage = 'Korisnik nije prijavljen.';
      return;
    }

    const formData = new FormData();

    formData.append('Title', formValues.title);
    formData.append('Description', formValues.description);
    console.log('gift category: ', formValues.giftCategory.toString());
    formData.append('GiftCategory', formValues.giftCategory.toString());
    formData.append('Contact', formValues.contact);
    formData.append('UserId', userId.toString());

    if (this.isEditMode) {

      if (this.giftId === null) {
        this.errorMessage = 'Nije pronađen ID poklona.';
        return;
      }

      formData.append('Id', this.giftId.toString());
    }

    if (this.selectedFile) {
      formData.append('Attachment', this.selectedFile);
    }

    if (this.isEditMode) {

      this.giftService.update(formData).subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Uspešno!',
            text: 'Objava uspešno izmenjena.'
          });

          this.goBack();
        },

        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Došlo je do greške pri izmeni objave.',
            confirmButtonText: 'U redu'
          });
        }
      });

    } else {

      this.giftService.create(formData).subscribe({
        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Uspešno!',
            text: 'Objava uspešno dodata.'
          });

          this.goBack();
        },

        error: (err) => {
          console.error(err);

          Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Došlo je do greške pri dodavanju objave.',
            confirmButtonText: 'U redu'
          });
        }
      });
    }
  }

  cancel(): void {
    this.goBack();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  categoryLabels: Record<GiftCategory, string> = {
    [GiftCategory.Clothing]: 'Odeća',
    [GiftCategory.Electronics]: 'Elektronski uređaji',
    [GiftCategory.Books]: 'Knjige',
    [GiftCategory.Toys]: 'Igračke',
    [GiftCategory.Furniture]: 'Nameštaj',
    [GiftCategory.Household]: 'Domaćinstvo',
    [GiftCategory.Sports]: 'Sport',
    [GiftCategory.Other]: 'Drugo'
  };

  selectCategory(giftCategory: GiftCategory): void {
    this.selectedCategory = giftCategory;

    this.giftForm.patchValue({
      giftCategory: giftCategory
    });

    this.isDropdownOpen = false;
  }

  loadGift(id: number): void {

    this.giftService.getById(id).subscribe({

      next: (gift: Gift) => {

        this.giftForm.patchValue({
          title: gift.title,
          description: gift.description,
          giftCategory: gift.giftCategory,
          contact: gift.contact,

          postDate: gift.postDate
            ? new Date(gift.postDate).toISOString().split('T')[0]
            : null,

          expireDate: gift.expireDate
            ? new Date(gift.expireDate).toISOString().split('T')[0]
            : null
        });

        this.selectedCategory = gift.giftCategory;

        // Ako postoji slika, prikaži je
        if (gift.attachment) {
          this.previewUrl =
            'https://localhost:44375/images/Gifts/' + gift.attachment;
        }
      },

      error: (err) => {
        console.error('Greška pri učitavanju poklona:', err);
      }
    });
  }

  private goBack(): void {
    this.router.navigate(['/gifts']);
  }
}