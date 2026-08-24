import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Gift } from 'src/app/model/gift.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { GiftService } from 'src/app/services/gift.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gift-view',
  templateUrl: './gift-view.component.html',
  styleUrls: ['./gift-view.component.css']
})
export class GiftViewComponent implements OnInit{

  gift!: Gift;
  isSidebarOpen = false;
  user: User | null = null;
  owner: User | null = null;
  isRequest = false;

  constructor(
    private route: ActivatedRoute,
    private giftService: GiftService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ){}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser();
    if(id){
      this.loadGift(id);
    }
  }

  loadGift(id: number){
    
    this.giftService.getById(id).subscribe({
      next: (request) => {
        this.gift = request;
        this.userService.getById(this.gift.userId).subscribe({
          next: (owner) => {
            this.owner = owner;
          },
          error: (err) => {
            console.error(err);
          }
        });
      },
      error: (err) => console.error('Greška pri učitavanju objave', err)
    });
  }

  loadUser() {
    const id = this.authService.getId();

    this.userService.getById(Number(id)).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/pictures/help-placeholder.png';
  }

  get isAdminOrOwner(): boolean {
    const role = this.authService.getRole();
    const userId = Number(this.authService.getId());

    if (!this.gift || !userId) return false;

    return role === 'Admin' || userId === this.gift.userId;
  }


  goBack() {
    this.router.navigate(['/gifts']);
  }

  editGift(id: number){
    this.router.navigate(['/gift/edit', id]);
  }


 deleteGift(id: number) {
    Swal.fire({
      title: 'Da li ste sigurni?',
      text: 'Ova akcija je nepovratna!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#852e2e',
      cancelButtonColor: '#398fb2',
      confirmButtonText: 'Obrišite',
      cancelButtonText: 'Otkažite'
    }).then((result) => {
      if (result.isConfirmed) {
        this.giftService.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Obrisano!',
              text: 'Objava je uspešno obrisana.',
              timer: 2000,
              showConfirmButton: false
            });
            this.goBack();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Greška!',
              text: 'Došlo je do greške prilikom brisanja objave.'
            });
          }
        });
      }
    });
  }
}
