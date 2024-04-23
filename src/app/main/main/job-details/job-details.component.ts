import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../service/shipment.service';
import { ActivatedRoute } from '@angular/router';
import { AddressModel } from '../../model/address.model';
import { CargoModel } from '../../model/cargo.model';
import { Observable, catchError, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CargoService } from '../../service/cargo.service';
import { AddressService } from '../../service/address.service';
import { GeneralResponse } from 'src/app/share/Model/general.response';
import * as L from 'leaflet'; 
import { AuthService } from 'src/app/authentication/Service/auth.service';

interface LocationInfomodel {
  isoCode: string;
  city: string;
  country: string;
  state: string;
  lat: number;
  lon: number;
  country_code: string;
  postCode: string;
  suburb: string;
  display_name: string;
  road: string;
  village: string;
  neighbourhood: string;
  houseNumber: string;
}


@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent implements OnInit,AfterViewInit{


  shipment!:{
    id:string,
    title:string,
    description:string,
    status:string,
    shipmentDate:string,
    creationDate:string,
    startLocation:AddressModel,
    endLocation:AddressModel,
    cargo:CargoModel,
    startLocationName:string | undefined,
    endLocationName:string | undefined,
    userId:string
};
map!: L.Map;
  location!:L.Marker;
  marker1!: L.Marker;
  marker2!: L.Marker;
  rooute!: L.Polyline;
  fuelEfficiency: number = 10;
  fuelCostPerLiter :number  = 1.5;
  cargoWeight: number = 1000;

  constructor(private shipmentServ:ShipmentService ,
              private route:ActivatedRoute,
              private http:HttpClient,
              private cargoServ:CargoService,
              private addressServ:AddressService,
              public auth:AuthService){}

  ngOnInit(): void {
    let id = this.route.snapshot.params['id']
    this.shipmentServ.GetSignleShipment(id).subscribe(data=>{
      console.log(data);
         
        let startLocation:AddressModel;
        let endLocation:AddressModel;
        let cargo:CargoModel;
        let cargoId=  data.value.cargoId.value
        let startLocationId = data.value.startLocation.value
        let endLocationId = data.value.endLocation.value
        console.log(cargoId);
        
        this.cargoServ.GetSingleCargo(cargoId).subscribe((cargoModel:GeneralResponse<CargoModel>)=>{
          if(cargoModel.value)
            cargo = cargoModel.value


          this.addressServ.GetSingleAddress(startLocationId).subscribe((startLocationResponse:GeneralResponse<AddressModel>)=>{
            if(startLocationResponse.value)
              startLocation = startLocationResponse.value
  
  
            this.addressServ.GetSingleAddress(endLocationId).subscribe((endLocationResponse:GeneralResponse<AddressModel>)=>{
              if(endLocationResponse.value)
                endLocation = endLocationResponse.value;
                  

                  let shipment ={
                                id:data.value.id.value,
                                title:data.value.title,
                                description:data.value.description,
                                startLocation:startLocation,
                                endLocation:endLocation,
                                status:data.value.status,
                                shipmentDate:data.value.shipmentDate,
                                creationDate:data.value.creationDate,
                                cargo:cargo,
                                startLocationName:startLocationResponse.value?.locationName,
                                endLocationName:endLocationResponse.value?.locationName,
                                userId:data.value.userId}

                  this.shipment = shipment;
                  console.log(shipment.startLocation.locationName);
                  
                    console.log(this.shipment)
                    console.log(this.auth.user?.id);
                    
                    this.initMap();
          })

        });
    

        
        
        
      });
    })

      console.log(this.shipment);
      
  }

  ngAfterViewInit(): void {
    
  }


  initMap(): void {
    this.map = L.map('map').setView([30.0444, 31.2357], 6); // Initial map center and zoom level
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  
    this.marker1 = L.marker([this.shipment.startLocation.lat, this.shipment.startLocation.lon]).addTo(this.map).bindPopup('Start').openPopup();
    this.marker2 = L.marker([this.shipment.endLocation.lat, this.shipment.endLocation.lon]).addTo(this.map).bindPopup('End').openPopup();
    
    this.getDrivingTime(this.getStartLatLng(),this.getEndLatLng())
    this.getRoute(this.getStartLatLng(), this.getEndLatLng());
  }
  

  getStartLatLng(): L.LatLng {
    return this.marker1.getLatLng();
  }

  getEndLatLng(): L.LatLng {
    return this.marker2.getLatLng();
  }


  getRoute(startLatLng: L.LatLng, endLatLng: L.LatLng): void {
    // console.log(`${startLatLng.lng},${startLatLng.lat};${endLatLng.lng},${endLatLng.lat}`);
    
    // const url = `http://router.project-osrm.org/route/v1/driving/${startLatLng.lng},${startLatLng.lat};${endLatLng.lng},${endLatLng.lat}?overview=full&geometries=geojson&steps=true`;
    // this.http.get<any>(url).subscribe(
    //   (data) => {
    //     if (this.route) {
    //       this.map.removeLayer(this.rooute);
    //     }
    //     const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
    //     this.rooute = L.polyline(routeCoordinates, { color: 'blue' }).addTo(this.map);
    //     const distance = data.routes[0].legs[0].distance / 1000; // Distance in kilometers
    //     console.log('Route distance:', distance.toFixed(2), 'km');
    //     this.getFuelConsumption(startLatLng, endLatLng, distance);
    //   },
    //   (error) => {
    //     console.error('Error getting route:', error);
    //   }
    // );
    const url = `http://router.project-osrm.org/route/v1/driving/${startLatLng.lng},${startLatLng.lat};${endLatLng.lng},${endLatLng.lat}?overview=full&geometries=geojson&steps=true`;
    this.http.get<any>(url).subscribe(
      (data) => {
        if (this.route) {
          this.map.removeLayer(this.rooute);
        }
        const routeCoordinates = data.routes[0].geometry.coordinates.map((coord: any) => [coord[1], coord[0]]);
        this.rooute = L.polyline(routeCoordinates, { color: 'blue' }).addTo(this.map);
        const distance = data.routes[0].legs[0].distance / 1000; // Distance in kilometers
        console.log('Route distance:', distance.toFixed(2), 'km');
        this.getFuelConsumption(startLatLng, endLatLng, distance);
      },
      (error) => {
        console.error('Error getting route:', error);
      }
    );
  }


  getFuelConsumption(startLatLng: L.LatLng, endLatLng: L.LatLng, distance: number): void {
    console.log('Distance:', distance.toFixed(2), 'km');

    const fuelConsumption = (distance / 100) * this.fuelEfficiency;
    console.log('Fuel consumption:', fuelConsumption.toFixed(2), 'liters');
    const fuelCost = fuelConsumption * this.fuelCostPerLiter;
    console.log('Fuel cost:', fuelCost.toFixed(2), 'USD');

    const cargoCost = this.calculateCargoCost();
    console.log('Cargo cost:', cargoCost.toFixed(2), 'USD');

    const totalCost = fuelCost + cargoCost;
    console.log('Total cost:', totalCost.toFixed(2), 'USD');
}

getDrivingTime(startLatLng: L.LatLng, endLatLng: L.LatLng): void {
  const url = `http://router.project-osrm.org/route/v1/driving/${startLatLng.lng},${startLatLng.lat};${endLatLng.lng},${endLatLng.lat}?overview=false`;
  this.http.get<any>(url).subscribe(
    (data) => {
      const duration = data.routes[0].duration / 60; // Convert duration from seconds to minutes
      
      console.log('Driving time:', duration.toFixed(2), 'minutes');
    },
    (error) => {
      console.error('Error getting driving time:', error);
    }
  );
}



  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

  calculateCargoCost(): number {
    // Assuming the cost is $0.1 per kg per km
    const cargoCostPerKm = 0.1;
    const distance = this.calculateDistance(this.marker1.getLatLng().lat, this.marker1.getLatLng().lng, this.marker2.getLatLng().lat, this.marker2.getLatLng().lng);
    return distance * this.cargoWeight * cargoCostPerKm;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }


  getLocationInfo(latitude: number, longitude: number): Observable<LocationInfomodel> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
    return this.http.get<any>(url).pipe(
      map((data) => {
        const info = data.address;
        return {
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
      }),
      catchError((error) => {
        console.error('Error getting location info:', error);
        throw error;
      })
    );
  }

  acceptShipment(){
      this.shipmentServ.AcceptShipment(this.shipment.id).subscribe(data=>{
        console.log(data);
        
      });
  }
}
