import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService }from 'ngx-bootstrap/modal'
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet'
import { LocationInfoModel } from '../../model/location-info.model';
import { Observable } from 'rxjs';
import { ShipmentService } from '../../service/shipment.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GetTotalPriceRequest } from '../../model/request/get-total-price.request';
import { CreateShipmentRequest } from '../../model/request/create-shipment.request';
import { AuthService } from 'src/app/authentication/Service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements AfterViewInit,OnInit{

  @ViewChild('template') template: any;
  @ViewChild('startLocation') startLocation!: ElementRef;
  @ViewChild('endLocation') endLocation!: ElementRef;

  modalRef!: BsModalRef;
  map: any;
  marker: any;
  selectedPoint: { latitude: number, longitude: number, title: string, description: string, materialType: string, weight: number } | null = null;
  location1: LocationInfoModel | null = null;
  location2: LocationInfoModel | null = null;
  formCreation!:FormGroup;
  TotalPrice!:string;
  selectedType!:string;

  constructor(private modalService: BsModalService, private http: HttpClient,private  shipmentServ:ShipmentService,private authServ:AuthService,private router:Router) { }


  ngOnInit(): void {
    
    this.formCreation = new FormGroup
    (
        {
          title: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          weight: new FormControl('',[Validators.required]),
          type:new FormControl('',Validators.required),
          date:new FormControl('',Validators.required)
        }
    );
  }

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
    console.log(latitude);
    console.log(longitude);
    
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
    this.http.get<any>(url).subscribe(
      (data) => {
        const info = data.address;
        console.log(data);
        
        if (location === 'location1') {
          this.location1 = {
            isoCode: info['ISO3166-2-lvl4'],
            city: info.city,
            country: info.country,
            state: info.state,
            lat: data.lat,
            lon: data.lon,
            country_code: info.country_code,
            postCode: info.postcode,
            suburb: info.Suburb,
            display_name: data.display_name,
            road: info.road,
            village: info.village,
            neighbourhood: info.neighbourhood,
            houseNumber: info.house_number
          };
          console.log(this.startLocation);
          
          this.startLocation.nativeElement.value = this.location1.display_name;
        } else if (location === 'location2') {
          this.location2 = {
            isoCode: info['ISO3166-2-lvl4'],
            city: info.city,
            country: info.country,
            state: info.state,
            lat: data.lat,
            lon: data.lon,
            country_code: info.country_code,
            postCode: info.postcode,
            suburb: info.Suburb,
            display_name: data.display_name,
            road: info.road,
            village: info.village,
            neighbourhood: info.neighbourhood,
            houseNumber: info.house_number
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

  GetTotalPrice()
  {
    if(!this.location1?.city && !this.location2?.city)
    {
      console.log('city is empity');
      
    }
    let request:GetTotalPriceRequest ={
    cargoType:this.formCreation.controls['type'].value,
    weight:this.formCreation.controls['weight'].value,
    startLocation:{state:this.location1? this.location1.state:''
                            ,city:this.location1?this.location1.city:'',
                            lat:this.location1?this.location1.lat:0,
                            lon:this.location1?this.location1.lon:0,
                            isoCode:this.location1?this.location1.isoCode:'',
                            postCode:this.location1?this.location1.postCode:'',
                            road:this.location1?this.location1.road:'',
                            village:this.location1?this.location1.village:'',
                            houseNumber:this.location1?this.location1.houseNumber:'',
                            locationName:this.location1?this.location1.display_name:''},

    endLocation:{state:this.location2? this.location2.state:''
                          ,city:this.location2?this.location2.city:'',
                          lat:this.location2?this.location2.lat:0,
                          lon:this.location2?this.location2.lon:0,
                          isoCode:this.location2?this.location2.isoCode:'',
                          postCode:this.location2?this.location2.postCode:'',
                          road:this.location2?this.location2.road:'',
                          village:this.location2?this.location2.village:'',
                          houseNumber:this.location2?this.location2.houseNumber:'',
                          locationName:this.location2?this.location2.display_name:''},

    }
    console.log('request',request);
    
    this.shipmentServ.GetTotalPrice(request).subscribe((data:any)=>{
      console.log(data);
      this.TotalPrice = (data.value as number).toFixed(2);  
    })
  }



  FormSubmited()
 {
    let createShipment: CreateShipmentRequest = {

    cargoType: this.formCreation.controls['type'].value,
    weight: this.formCreation.controls['weight'].value,
    startLocation: {
              state: this.location1 ? this.location1.state : '',
              city: this.location1 ? this.location1.city : '',
              lat: this.location1 ? this.location1.lat : 0,
              lon: this.location1 ? this.location1.lon : 0,
              isoCode: this.location1 ? this.location1.isoCode : '',
              postCode: this.location1 ? this.location1.postCode : '',
              road: this.location1 ? this.location1.road : '',
              village: this.location1 ? this.location1.village ?? '' : '',
              houseNumber: this.location1 ? this.location1.houseNumber : '',
              locationName: this.location1 ? this.location1.display_name : ''
    },
    endLocation: {
            state: this.location2 ? this.location2.state : '',
            city: this.location2 ? this.location2.city : '',
            lat: this.location2 ? this.location2.lat : 0,
            lon: this.location2 ? this.location2.lon : 0,
            isoCode: this.location2 ? this.location2.isoCode : '',
            postCode: this.location2 ? this.location2.postCode : '',
            road: this.location2 ? this.location2.road : '',
            village: this.location2 ? this.location2.village ?? '' : '',
            houseNumber: this.location2 ? this.location2.houseNumber : '',
            locationName: this.location2 ? this.location2.display_name : ''
    },
    title: this.formCreation.controls['title'].value,
    description: this.formCreation.controls['description'].value,
    shipmentDate: this.formCreation.controls['date'].value,
    userId: this.authServ.user?.id ?? ""
  };

    console.log(createShipment);

    this.shipmentServ.CreateShipment(createShipment).subscribe(data => {
      console.log(data);
      if (data.errors.length == 0) this.router.navigate([''])
    });
}




}
