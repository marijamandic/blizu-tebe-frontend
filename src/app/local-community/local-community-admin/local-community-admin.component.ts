import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LocalCommunity } from 'src/app/model/localcommunity.model';
import { LocalCommunityService } from 'src/app/services/localcommunity.service';
import 'leaflet-draw';

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

  constructor(private service: LocalCommunityService) {}

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
        showArea: true
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
              style: { color: 'blue', fillOpacity: 0.2 }
            }).bindPopup(c.name).addTo(this.map);
          }
        });
      }
    });
  }

  saveCommunity(): void {
    if (!this.drawnPolygon || !this.communityName || !this.communityCity) {
      alert('Popunite obavezna polja i nacrtajte granicu!');
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
        alert('Mesna zajednica uspešno dodata!');
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
