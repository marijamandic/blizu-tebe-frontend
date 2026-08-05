import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HelpCategory, HelpRequest } from 'src/app/model/help-request.model';
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
  isEditMode = false;
  requestId: number | null = null;
  isRequest = false;

  constructor(
    private fb: FormBuilder,
    private helpRequestService: HelpRequestService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
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

    this.isRequest = !this.router.url.toLowerCase().includes('helpoffer');

    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    if(this.requestId){
      this.isEditMode = true;
      this.loadRequest(this.requestId);
    }
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

    // const dto = {
    //   title: formValues.title,
    //   description: formValues.description,
    //   category: formValues.category,
    //   contact: formValues.contact,
    //   postDate: formValues.postDate,
    //   expireDate: formValues.expireDate,
    //   userId: this.authService.getId(),
    //   localCommunityId: formValues.localCommunityId,
    //   helpType: this.isRequest ? 0 : 1,
    //   attachment: this.selectedFile ? this.selectedFile.name : null
    // };

    const formData = new FormData();

    formData.append('title', formValues.title);
    formData.append('description', formValues.description);
    formData.append('category', formValues.category);
    formData.append('contact', formValues.contact);
    const userId = this.authService.getId();

    if (userId == null) {
      this.errorMessage = "Korisnik nije prijavljen.";
      return;
    }
    formData.append('userId', userId.toString());
    formData.append('helpType', (this.isRequest ? 0 : 1).toString());

    if (this.selectedFile) {
      formData.append('attachment', this.selectedFile);
    }
    // console.log(dto);
    // console.log(typeof dto.category);
    // console.log(dto.category);

    if(this.isEditMode){
      this.helpRequestService.update(this.requestId!, formData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Uspešno!',
            text: 'Objava uspešno izmenjena.'
          });
          this.goBack();

        },
        error: (err) => {
          console.log(err.error);
          console.log(err.error.errors);
          console.log('STATUS:', err.status);
          console.log('MESSAGE:', err.message);

          Swal.fire({
            icon: 'error',
            title: 'Greška',
            text: 'Došlo je do greške pri izmeni objave.',
            confirmButtonText: 'U redu'
          });
        }
      })
    } else{
    this.helpRequestService.create(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Objava uspešno dodata.'
        });

        this.goBack();
      },
      error: (err) => {
        console.log(err.error);
        console.log(err.error.errors);
        console.log('STATUS:', err.status);
        console.log('MESSAGE:', err.message);

        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Došlo je do greške pri dodavanju objave.',
          confirmButtonText: 'U redu'
        });
      }
    })}
  }

  cancel() {
    this.goBack();
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

  loadRequest(id: number){
    this.helpRequestService.getById(id).subscribe({
      next: (res: HelpRequest) => {
        this.requestForm.patchValue({
          title: res.title,
          description: res.description,
          category: res.category,
          contact: res.contact,
          postDate: res.postDate
            ? new Date(res.postDate).toISOString().split('T')[0]
            : null,
          expireDate: res.expireDate
            ? new Date(res.expireDate).toISOString().split('T')[0]
            : null,
          attachment: res.attachment
        });
        this.selectedCategory = res.category;
      },
      error: (err) => console.error(err)
    });
  }

  private goBack() {
    this.router.navigate([
      this.isRequest ? '/helpRequests' : '/helpOffers'
    ]);
  }
}
