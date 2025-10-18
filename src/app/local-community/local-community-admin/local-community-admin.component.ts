import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  constructor(private service: LocalCommunityService) {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    // Inicijalizuj mapu centriranu na Novi Sad
    this.map = L.map('map').setView([45.2671, 19.8335], 13);

    // OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Layer za crtanje
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    // Alati za crtanje
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

    // Event kada se nacrta polygon
    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      this.drawnItems.clearLayers();
      this.drawnItems.addLayer(layer);
      
      // Konvertuj u GeoJSON
      this.drawnPolygon = layer.toGeoJSON();
      console.log('Nacrtani polygon:', this.drawnPolygon);
    });

    // Učitaj postojeće mesne zajednice
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
      alert('Popunite sva polja i nacrtajte granicu!');
      return;
    }

    const community: LocalCommunity = {
      name: this.communityName,
      city: this.communityCity,
      boundary: JSON.stringify(this.drawnPolygon.geometry),
      centerPoint: this.calculateCenter(this.drawnPolygon),
      presidentId: 1001,
    };

    this.service.create(community).subscribe({
      next: () => {
        alert('Mesna zajednica uspešno dodata!');
        this.drawnItems.clearLayers();
        this.drawnPolygon = null;
        this.communityName = '';
        this.communityCity = '';
        this.loadExistingCommunities();
      },
      error: (err) => {
      console.error('Greška:', err);
      console.error('Detalji:', err.error); 
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
