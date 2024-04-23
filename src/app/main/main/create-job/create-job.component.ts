import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService }from 'ngx-bootstrap/modal'
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet'
import { LocationInfoModel } from '../../model/location-info.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements AfterViewInit{

  @ViewChild('template') template: any;
  @ViewChild('startLocation') startLocation!: ElementRef;
  @ViewChild('endLocation') endLocation!: ElementRef;

  modalRef!: BsModalRef;
  map: any;
  marker: any;
  selectedPoint: { latitude: number, longitude: number, title: string, description: string, materialType: string, weight: number } | null = null;
  location1: LocationInfoModel | null = null;
  location2: LocationInfoModel | null = null;

  constructor(private modalService: BsModalService, private http: HttpClient) { }

  ngAfterViewInit(): void {
  }

  openModal1() {
    this.modalRef = this.modalService.show(this.template);
    this.initMap('location1');
  }

  openModal2() {
    this.modalRef = this.modalService.show(this.template);
    this.initMap('location2');
  }

  initMap(location: string) {
    this.map = L.map('map').setView([30.0444, 31.2357], 6); // Initial map center and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add marker on map click
    this.map.on('click', (e: any) => {
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker(e.latlng, { draggable: true }).addTo(this.map).bindPopup('Selected Point').openPopup();
      this.selectedPoint = {
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
        title: '',
        description: '',
        materialType: '',
        weight: 0
      };

      this.getLocationInfo(this.selectedPoint.latitude, this.selectedPoint.longitude, location);
    });
  }

  getLocationInfo(latitude: number, longitude: number, location: string) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
    this.http.get<any>(url).subscribe(
      (data) => {
        const info = data.address;
        if (location === 'location1') {
          this.location1 = {
            isoCode: info['ISO3166-2-lvl4'],
            city: info.City,
            country: info.country,
            state: info.state,
            lat: data.lat,
            lng: data.lon,
            country_code: info.country_code,
            postCode: info.postcode,
            suburb: info.Suburb,
            display_name: data.display_name,
            road: info.road,
            village: info.village,
            neighbourhood: info.neighbourhood
          };
          console.log(this.startLocation);
          
          this.startLocation.nativeElement.value = this.location1.display_name;
        } else if (location === 'location2') {
          this.location2 = {
            isoCode: info['ISO3166-2-lvl4'],
            city: info.City,
            country: info.country,
            state: info.state,
            lat: data.lat,
            lng: data.lon,
            country_code: info.country_code,
            postCode: info.postcode,
            suburb: info.Suburb,
            display_name: data.display_name,
            road: info.road,
            village: info.village,
            neighbourhood: info.neighbourhood
          };
          this.endLocation.nativeElement.value = this.location2.display_name;
        }
      },
      (error) => {
        console.error('Error getting location info:', error);
      }
    );
  }

  onPointSelected() {
    console.log("Selected Point:", this.selectedPoint);
    // You can access latitude and longitude like this
    if (this.selectedPoint) {
      const latitude = this.selectedPoint.latitude;
      const longitude = this.selectedPoint.longitude;
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
    }
  }
}
