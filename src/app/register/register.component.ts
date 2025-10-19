import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalCommunity } from '../model/localcommunity.model';
import { AuthService } from '../services/auth.service';
import { LocalCommunityService } from '../services/localcommunity.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  localCommunities: LocalCommunity[] = [];
  selectedFile?: File;
  previewUrl?: string;
  errorMessage = '';

  // Mapa
  showMap = false;
  private map?: L.Map;
  selectedCommunityFromMap?: LocalCommunity;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private localCommunityService: LocalCommunityService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      localCommunityId: [null, Validators.required],
      picture: [null]
    });

    this.loadLocalCommunities();
  }

  loadLocalCommunities(): void {
    this.localCommunityService.getAll().subscribe({
      next: (communities) => {
        this.localCommunities = communities;
      },
      error: (err) => console.error('Greška pri učitavanju mesnih zajednica:', err)
    });
  }

  onFileSelected(event: any): void {
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

  toggleMap(): void {
    this.showMap = !this.showMap;
    if (this.showMap) {
      setTimeout(() => this.initMap(), 100);
    }
  }

  initMap(): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('registerMap').setView([45.2671, 19.8335], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Učitaj sve mesne zajednice na mapu
    this.localCommunities.forEach(community => {
      if (community.boundary) {
        const boundaryJson = JSON.parse(community.boundary);
        const geoJsonLayer = L.geoJSON(boundaryJson, {
          style: {
            color: '#4db1d9ff',
            weight: 2,
            fillOpacity: 0.3
          }
        }).bindPopup(`<b>${community.name}</b><br>${community.city}`);

        geoJsonLayer.addTo(this.map!);

        geoJsonLayer.on('click', () => {
          this.selectCommunityFromMap(community);
        });

        geoJsonLayer.on('mouseover', () => {
        geoJsonLayer.setStyle({ fillOpacity: 0.6 });
      });

      geoJsonLayer.on('mouseout', () => {
        geoJsonLayer.setStyle({ fillOpacity: 0.3 });
      });
      }
    });

    // Klik na mapu za pronalaženje mesne zajednice po koordinatama
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.findCommunityByLocation(e.latlng.lat, e.latlng.lng);
    });
  }

  findCommunityByLocation(lat: number, lng: number): void {
    this.localCommunityService.getByLocation(lat, lng).subscribe({
      next: (community) => {
        this.selectCommunityFromMap(community);
        alert(`Kliknuli ste na: ${community.name}, ${community.city}`);
      },
      error: () => {
        alert('Ova lokacija nije u okviru nijedne mesne zajednice');
      }
    });
  }

  selectCommunityFromMap(community: LocalCommunity): void {
    this.selectedCommunityFromMap = community;
    this.registerForm.patchValue({
      localCommunityId: community.id
    });
    this.showMap = false;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Popunite sva obavezna polja';
      return;
    }

    const formData = new FormData();
    formData.append('username', this.registerForm.value.username);
    formData.append('password', this.registerForm.value.password);
    formData.append('name', this.registerForm.value.name);
    formData.append('surname', this.registerForm.value.surname);
    formData.append('dateOfBirth', this.registerForm.value.dateOfBirth);

    if (this.registerForm.value.localCommunityId) {
      formData.append('localCommunityId', this.registerForm.value.localCommunityId);
    }

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
    }

    this.userService.register(formData).subscribe({
      next: () => {
        Swal.fire({
      icon: 'success',
      title: 'Uspešno!',
      text: 'Uspešna registracija, sačekajte da vas administrator validira.',
      timer: 4000,
      showConfirmButton: false
    });
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMessage = 'Greška pri registraciji: ' + (err.error?.message || 'Pokušajte ponovo');
        console.error('Greška:', err);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }



}
