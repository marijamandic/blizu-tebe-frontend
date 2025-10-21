import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-community',
  templateUrl:'./view-community.component.html',
  styleUrls: ['./view-community.component.css'],
})
export class ViewCommunityComponent implements OnInit, AfterViewInit {

  community!: LocalCommunity;
  presidentName: string = '';
  isSidebarOpen = false;
  private map!: L.Map;
  private mapInitialized = false;

  constructor(
    private route: ActivatedRoute,
    private localCommunityService: LocalCommunityService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) this.loadCommunity(id);
  }

  ngAfterViewInit(): void {
    // Sačekaj malo pre inicijalizacije mape (DOM mora biti spreman)
    setTimeout(() => {
      this.initMap();
      this.mapInitialized = true;
      if (this.community) this.loadCommunityOnMap();
    }, 100);
  }

  private initMap(): void {
    const mapElement = document.getElementById('communityMap');
    if (!mapElement) {
      console.error('Map element not found!');
      return;
    }

    this.map = L.map(mapElement).setView([45.2671, 19.8335], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  private loadCommunity(id: number): void {
    this.localCommunityService.getById(id).subscribe({
      next: (lc) => {
        this.community = lc;

        if (this.mapInitialized) this.loadCommunityOnMap();

        if (lc.presidentId) {
          this.userService.getById(lc.presidentId).subscribe({
            next: (user) =>
              (this.presidentName = `${user.name} ${user.surname}`),
            error: () => (this.presidentName = 'Nepoznato'),
          });
        }
      },
      error: (err) =>
        console.error('Greška pri učitavanju mesne zajednice:', err),
    });
  }

  private loadCommunityOnMap(): void {
    if (!this.community?.boundary || !this.map) return;

    try {
      const boundaryJson = JSON.parse(this.community.boundary);
      const polygon = L.geoJSON(boundaryJson, {
        style: {
          color: '#4db1d9ff',
          fillColor: '#4db1d9ff',
          fillOpacity: 0.3,
          weight: 2,
        },
      }).addTo(this.map);

      this.map.fitBounds(polygon.getBounds());
    } catch (e) {
      console.error('Greška pri parsiranju boundary JSON-a', e);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
