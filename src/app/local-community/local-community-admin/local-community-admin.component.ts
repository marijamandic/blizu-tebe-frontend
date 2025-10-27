import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import 'leaflet-draw';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-local-community-admin',
  templateUrl: './local-community-admin.component.html',
  styleUrls: ['./local-community-admin.component.css'],
})
export class LocalCommunityAdminComponent implements OnInit {
  private map!: L.Map;
  private drawnItems!: L.FeatureGroup;
  drawnPolygon: any = null;

  communityName = '';
  communityCity = '';
  phoneNumber = '';
  facebook = '';
  isSidebarOpen = false;
  errorMessage = '';
  nameError = false;
  cityError = false;
  mapError = false;

  constructor(private service: LocalCommunityService, private router: Router) {}

  ngOnInit(): void {
    this.initMap();
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
        color: 'red',       // boja linije
        fillColor: 'orange', // boja popunjenog poligona
        fillOpacity: 0.3,    // providnost popune
        weight: 3            // debljina linije
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

  this.loadExistingCommunities();
}

  loadExistingCommunities(): void {
    this.service.getAll().subscribe({
      next: (communities) => {
        communities.forEach(c => {
          if (c.boundary) {
            const boundaryJson = JSON.parse(c.boundary);
            L.geoJSON(boundaryJson, {
              style: { color: '#4db1d9ff', fillOpacity: 0.2 }
            }).bindPopup(c.name).addTo(this.map);
          }
        });
      }
    });
  }

  saveCommunity(): void {
    this.errorMessage = '';
    this.nameError = false;
    this.cityError = false;
    this.mapError = false;

    if (!this.communityName || !this.communityCity || !this.drawnPolygon) {
      if (!this.communityName) this.nameError = true;
      if (!this.communityCity) this.cityError = true;
      if (!this.drawnPolygon) this.mapError = true;

      this.errorMessage = 'Popunite sva obavezna polja i nacrtajte novu granicu na mapi!';
      return;
    }

    const community: LocalCommunity = {
      name: this.communityName,
      city: this.communityCity,
      boundary: JSON.stringify(this.drawnPolygon.geometry),
      centerPoint: this.calculateCenter(this.drawnPolygon),
      presidentId: this.getId() ?? undefined,
      phoneNumber: this.phoneNumber || undefined,
      facebook: this.facebook || undefined
    };

    this.service.create(community).subscribe({
      next: () => {
        Swal.fire({
      icon: 'success',
      title: 'Uspešno!',
      text: 'Mesna zajednica je uspešno dodata.',
      timer: 3000,
      showConfirmButton: false
    }).then(() => {
    this.router.navigate(['/community/all']);
  });
        this.drawnItems.clearLayers();
        this.drawnPolygon = null;
        this.communityName = '';
        this.communityCity = '';
        this.phoneNumber = '';
        this.facebook = '';
        this.loadExistingCommunities();
      },
      error: (err) => {
        console.error('Greška:', err);
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
}
