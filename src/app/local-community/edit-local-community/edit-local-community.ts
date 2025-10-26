import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as L from 'leaflet';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-local-community',
  templateUrl: './edit-local-community.html',
  styleUrls: ['./edit-local-community.css'],
})
export class EditLocalCommunity implements OnInit {
  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  drawnPolygon: any = null;

  communityId!: number;
  communityName = '';
  communityCity = '';
  phoneNumber = '';
  facebook = '';
  isSidebarOpen = false;
  errorMessage = '';
  nameError = false;
  cityError = false;
  mapError = false;

  constructor(
    private service: LocalCommunityService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.communityId = Number(this.route.snapshot.paramMap.get('id'));
    this.initMap();
    this.loadCommunityData();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  private getId(): number | null {
    const token = localStorage.getItem('jwt');
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload['id'] ? parseInt(decodedPayload['id'], 10) : null;
    } catch (e) {
      console.error('Greška pri dekodiranju tokena', e);
      return null;
    }
  }

  initMap(): void {
    this.map = L.map('map').setView([45.2671, 19.8335], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          shapeOptions: {
            color: 'red',
            fillColor: 'orange',
            fillOpacity: 0.3,
            weight: 3
          }
        },
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: true
      }
    });
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      this.drawnItems.clearLayers();
      this.drawnItems.addLayer(layer);
      this.drawnPolygon = layer.toGeoJSON();
      console.log('Nacrtani polygon:', this.drawnPolygon);
    });

    this.map.on(L.Draw.Event.EDITED, (event: any) => {
      const layers = event.layers;
      layers.eachLayer((layer: any) => {
        this.drawnPolygon = layer.toGeoJSON();
        console.log('Izmenjen polygon:', this.drawnPolygon);
      });
    });

    this.map.on(L.Draw.Event.DELETED, (event: any) => {
      this.drawnPolygon = null;
      console.log('Polygon obrisan');
    });

    this.loadOtherCommunities();
  }

  loadCommunityData(): void {
    this.service.getById(this.communityId).subscribe({
      next: (community) => {
        this.communityName = community.name;
        this.communityCity = community.city;
        this.phoneNumber = community.phoneNumber || '';
        this.facebook = community.facebook || '';

        if (community.boundary) {
          const boundaryJson = JSON.parse(community.boundary);
          this.drawnPolygon = { geometry: boundaryJson };

          // Konvertuj koordinate iz GeoJSON formata [lng, lat] u Leaflet format [lat, lng]
          const coordinates = boundaryJson.coordinates[0].map((coord: number[]) => 
            [coord[1], coord[0]] as L.LatLngExpression
          );

          // Kreiraj polygon direktno kao Leaflet layer koji može da se edituje
          const polygon = L.polygon(coordinates, {
            color: 'red',
            fillColor: 'orange',
            fillOpacity: 0.3,
            weight: 3
          });

          this.drawnItems.addLayer(polygon);

          // Centriraj mapu na poligon
          const bounds = polygon.getBounds();
          this.map.fitBounds(bounds);
        }
      },
      error: (err) => {
        console.error('Greška pri učitavanju mesne zajednice:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Nije moguće učitati podatke o mesnoj zajednici.'
        });
      }
    });
  }

  loadOtherCommunities(): void {
    this.service.getAll().subscribe({
      next: (communities) => {
        communities.forEach(c => {
          if (c.id !== this.communityId && c.boundary) {
            const boundaryJson = JSON.parse(c.boundary);
            L.geoJSON(boundaryJson, {
              style: { 
                color: '#999', 
                fillColor: '#ddd',
                fillOpacity: 0.1,
                weight: 1
              }
            }).bindPopup(c.name).addTo(this.map);
          }
        });
      }
    });
  }

  updateCommunity(): void {
    this.errorMessage = '';
    this.nameError = false;
    this.cityError = false;
    this.mapError = false;
    
    if (!this.communityName || !this.communityCity || !this.drawnPolygon) {
      if (!this.communityName) this.nameError = true;
      if (!this.communityCity) this.cityError = true;
      if (!this.drawnPolygon) this.mapError = true;

      this.errorMessage = 'Popunite sva obavezna polja!';
      return;
    }

    const community: LocalCommunity = {
      id: this.communityId,
      name: this.communityName,
      city: this.communityCity,
      boundary: JSON.stringify(this.drawnPolygon.geometry),
      centerPoint: this.calculateCenter(this.drawnPolygon),
      presidentId: this.getId() ?? undefined,
      phoneNumber: this.phoneNumber || undefined,
      facebook: this.facebook || undefined
    };

    this.service.update(this.communityId, community).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Uspešno!',
          text: 'Mesna zajednica je uspešno izmenjena.',
          timer: 3000,
          showConfirmButton: false
        });
        this.router.navigate(['/view-community', this.communityId]);
      },
      error: (err) => {
        console.error('Greška:', err);
        Swal.fire({
          icon: 'error',
          title: 'Greška',
          text: 'Nije moguće sačuvati izmene.'
        });
      }
    });
  }

  calculateCenter(geoJson: any): [number, number] {
    const coords = geoJson.geometry.coordinates[0];
    const lngs = coords.map((c: number[]) => c[0]);
    const lats = coords.map((c: number[]) => c[1]);
    return [
      lngs.reduce((a: number, b: number) => a + b) / lngs.length,
      lats.reduce((a: number, b: number) => a + b) / lats.length
    ];
  }
  cancel() {
    this.router.navigate(['/view-community', this.communityId]);
  }
}