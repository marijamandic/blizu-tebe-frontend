import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gift, GiftCategory, GiftStatus } from 'src/app/model/gift.model';
import { GiftService } from 'src/app/services/gift.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css']
})
export class GiftComponent implements OnInit {

  gifts: Gift[] = [];

  isSidebarOpen = false;
  defaultImage = 'assets/pictures/help-placeholder.png';

  selectedStatus: GiftStatus = GiftStatus.Pending;
  selectedCategory: GiftCategory | null = null;

  page: number = 1;
  size: number = 6;

  totalCount: number = 0;
  totalPages: number = 0;
  mode: 'all' | 'mine' = 'all';

  GiftStatus = GiftStatus;

  constructor(
    private giftService: GiftService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadGifts();
  }

  loadGifts(): void {
    let gift$;

    switch (this.selectedStatus) {
      case GiftStatus.Pending:
        gift$ = this.giftService.getPending(this.page, this.size, this.selectedCategory ?? undefined);
        break;

      case GiftStatus.Completed:
        gift$ = this.giftService.getCompleted(this.page, this.size, this.selectedCategory ?? undefined);
        break;

      default:
        return;
    }

    gift$.subscribe({
      next: (response) => {
        this.totalCount = response.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.size);
        const currentUserId = Number(this.authService.getId());

        this.gifts = response.results.filter(x =>
          this.mode === 'all'
            ? true
            : x.userId === currentUserId
        );
      },
      error: (err) => {
        console.error('Greška pri učitavanju poklona:', err);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  goToAddGift(): void {
    this.userService.getCurrentUserFromApi().subscribe({
      next: (currentUser) => {
        if (currentUser && !currentUser.localCommunityId) {
          Swal.fire({
            icon: 'warning',
            title: 'Pažnja!',
            text: 'Morate izabrati mesnu zajednicu pre nego što dodate poklon.',
            confirmButtonText: 'U redu',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.router.navigate(['/gifts']);
          });
        } else {
          this.router.navigate(['/gift/add']);
        }
      },
      error: (err) => {
        console.error('Greška pri proveri korisnika:', err);

        Swal.fire({
          icon: 'error',
          title: 'Greška!',
          text: 'Došlo je do greške prilikom učitavanja korisnika.',
          confirmButtonText: 'U redu'
        });
      }
    });
  }

  goToGift(id: number): void {
    this.router.navigate(['/gift', id]);
  }

  setDefaultImage(event: Event): void {
    const element = event.target as HTMLImageElement;
    element.src = this.defaultImage;
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

  categories = [
    {
      value: GiftCategory.Clothing,
      name: 'Odeća',
      icon: 'checkroom'
    },
    {
      value: GiftCategory.Electronics,
      name: 'Elektronika',
      icon: 'devices'
    },
    {
      value: GiftCategory.Books,
      name: 'Knjige',
      icon: 'menu_book'
    },
    {
      value: GiftCategory.Toys,
      name: 'Igračke',
      icon: 'toys'
    },
    {
      value: GiftCategory.Furniture,
      name: 'Nameštaj',
      icon: 'chair'
    },
    {
      value: GiftCategory.Household,
      name: 'Domaćinstvo',
      icon: 'home'
    },
    {
      value: GiftCategory.Sports,
      name: 'Sport',
      icon: 'fitness_center'
    },
    {
      value: GiftCategory.Other,
      name: 'Drugo',
      icon: 'category'
    }
  ];

  changeStatus(status: GiftStatus): void {
    this.selectedStatus = status;
    this.page = 1;
    this.loadGifts();
  }

  changeCategory(category: GiftCategory | null): void {
    this.selectedCategory = category;
    this.page = 1;
    this.loadGifts();
  }

  changePage(page: number): void {
    this.page = page;
    this.loadGifts();
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadGifts();
    }
  }

  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadGifts();
    }
  }

}