import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Discussion } from 'src/app/model/discussion.model';
import { User } from 'src/app/model/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { DiscussionService } from 'src/app/services/discussion.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-disscussion.component',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.css'],
})
export class DiscussionComponent implements OnInit {
  discussions: Discussion[] = [];
  isSidebarOpen = false;
  currentUser!: User

  constructor(
    private discussionService: DiscussionService,
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.fetchDiscussions();
  }

 fetchDiscussions(): void {
  this.userService.getCurrentUserFromApi().subscribe({
    next: (currentUser) => {
      if (!currentUser) {
        console.error('Nije pronađen trenutni korisnik.');
        return;
      }

      this.currentUser = currentUser;

      this.discussionService.getAllDiscussions().subscribe({
        next: (data) => {
          const filteredDiscussions = data.filter(
            d => d.localCommunityId === this.currentUser.localCommunityId
          );

          this.discussions = filteredDiscussions;

          if (filteredDiscussions.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'Nema diskusija',
              text: 'Trenutno nema nijedna diskusija dostupna za vašu mesnu zajednicu.'
            });
          }
        },
        error: (err) => console.error('Greška pri učitavanju diskusija:', err)
      });
    },
    error: (err) => console.error('Greška pri učitavanju korisnika:', err)
  });
}

editDiscussion(discussion: Discussion): void {
  Swal.fire({
    title: 'Izmenite diskusiju',
    html: `
      <input id="title" class="swal2-input" placeholder="Naziv diskusije" value="${discussion.name}">
      <textarea id="desc" class="swal2-textarea" placeholder="Opis">${discussion.description || ''}</textarea>
    `,
    showCancelButton: true,
    confirmButtonText: 'Sačuvajte izmene',
    cancelButtonText: 'Otkažite',
    confirmButtonColor: '#398fb2',
    preConfirm: () => {
      const name = (document.getElementById('title') as HTMLInputElement).value;
      const description = (document.getElementById('desc') as HTMLTextAreaElement).value;
      if (!name.trim()) {
        Swal.showValidationMessage('Naziv ne može biti prazan.');
        return;
      }
      return { name, description };
    }
  }).then(result => {
    if (result.isConfirmed) {
      const updatedDiscussion: Discussion = {
        ...discussion,
        name: result.value!.name,
        description: result.value!.description
      };

      this.discussionService.updateDiscussion(discussion.id, updatedDiscussion).subscribe({
        next: (updated) => {
          const index = this.discussions.findIndex(d => d.id === updated.id);
          if (index !== -1) {
            this.discussions[index] = updated;
          }

          Swal.fire('Uspeh', 'Diskusija je uspešno izmenjena!', 'success');
        },
        error: (err) => {
          console.error('Greška pri izmeni diskusije:', err);
          Swal.fire('Greška', 'Neuspešna izmena diskusije.', 'error');
        }
      });
    }
  });
}
togglePin(discussion: Discussion): void {
  const updated = { ...discussion, isPinned: !discussion.isPinned };

  this.discussionService.updateDiscussion(discussion.id, updated).subscribe({
    next: (res) => {
      discussion.isPinned = res.isPinned;
      Swal.fire({
        icon: 'success',
        title: res.isPinned ? 'Diskusija je pinovana!' : 'Diskusija je otkačena.',
        showConfirmButton: false,
        timer: 1500
      });
      this.fetchDiscussions()
    },
    error: () => {
      Swal.fire('Greška', 'Neuspešno menjanje statusa pinovanja.', 'error');
    }
  });
}

  goToDiscussion(id: number): void {
    this.router.navigate(['/chat', id]);
  }

  createDiscussion(): void {
  if (!this.currentUser) {
    Swal.fire('Greška', 'Niste ulogovani ili korisnik nije učitan.', 'error');
    return;
  }

  Swal.fire({
    title: 'Nova diskusija',
    html: `
      <input id="title" class="swal2-input" placeholder="Naziv diskusije">
      <textarea id="desc" class="swal2-textarea" placeholder="Opis"></textarea>
    `,
    showCancelButton: true,
    confirmButtonText: 'Kreirajte',
    cancelButtonText: 'Otkažite',
    confirmButtonColor: '#398fb2',
    preConfirm: () => {
      const name = (document.getElementById('title') as HTMLInputElement).value;
      const description = (document.getElementById('desc') as HTMLTextAreaElement).value;
      if (!name.trim()) {
        Swal.showValidationMessage('Naziv ne može biti prazan.');
        return;
      }
      return { name, description };
    }
  }).then(result => {
    if (result.isConfirmed) {
      const newDiscussion: Discussion = {
        id: 0,
        name: result.value!.name,
        description: result.value!.description,
        createdAt: new Date(),
        isPinned: false,
        adminId: Number(this.authService.getId()),
        localCommunityId: this.currentUser.localCommunityId // 👈 ovde se dodaje
      };

      this.discussionService.createDiscussion(newDiscussion).subscribe({
        next: (created) => {
          Swal.fire('Uspeh', 'Diskusija je uspešno kreirana!', 'success');
          this.discussions.push(created);
        },
        error: (err) => {
          console.error('Greška pri kreiranju diskusije:', err);
          Swal.fire('Greška', 'Neuspešno kreiranje diskusije.', 'error');
        }
      });
    }
  });
}


  deleteDiscussion(id: number): void {
    Swal.fire({
      title: 'Obrišite diskusiju?',
      text: 'Ova akcija se ne može opozvati!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Obrišite',
      cancelButtonText: 'Otkažite',
      confirmButtonColor: '#398fb2',
    }).then(result => {
      if (result.isConfirmed) {
        this.discussionService.deleteDiscussion(id).subscribe({
          next: () => {
            this.discussions = this.discussions.filter(d => d.id !== id);
            Swal.fire('Obrisano!', 'Diskusija je uspešno obrisana.', 'success');
          },
          error: () => Swal.fire('Greška', 'Neuspešno brisanje diskusije.', 'error')
        });
      }
    });
  }

  get isAdmin(): boolean {
    return this.authService.getRole() === 'Admin';
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
