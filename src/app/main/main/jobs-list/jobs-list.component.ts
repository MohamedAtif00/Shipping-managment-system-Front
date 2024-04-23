import { Component, OnInit } from '@angular/core';
import { ShipmentService } from '../../service/shipment.service';
import { CargoService } from '../../service/cargo.service';
import { ShipmentModel } from '../../model/shipment.model';
import { CargoModel } from '../../model/cargo.model';
import { GeneralResponse } from 'src/app/share/Model/general.response';
import { AddressService } from '../../service/address.service';
import { AddressModel } from '../../model/address.model';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

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
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent implements OnInit{


  shipments:{
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
    endLocationName:string | undefined
}[] =[];


  constructor(private shipmentServ:ShipmentService,private cargoServ:CargoService,private adderssServ:AddressService,private http:HttpClient){}

  ngOnInit(): void {
    this.shipmentServ.GetAllShipment().subscribe(shipmentData=>{
      console.log(shipmentData);
      
      shipmentData.value.forEach((e:any) => {
        
        let startLocation:AddressModel;
        let endLocation:AddressModel;
        let cargo:CargoModel;
        let cargoId=  e.cargoId.value
        let startLocationId = e.startLocation.value
        let endLocationId = e.endLocation.value

        this.cargoServ.GetSingleCargo(cargoId).subscribe((cargoModel:GeneralResponse<CargoModel>)=>{
          if(cargoModel.value)
            cargo = cargoModel.value


          this.adderssServ.GetSingleAddress(startLocationId).subscribe((startLocationResponse:GeneralResponse<AddressModel>)=>{
            if(startLocationResponse.value)
              startLocation = startLocationResponse.value
  
  
            this.adderssServ.GetSingleAddress(endLocationId).subscribe((endLocationResponse:GeneralResponse<AddressModel>)=>{
              if(endLocationResponse.value)
                endLocation = endLocationResponse.value;


                  console.log('e',e);
                  

                  let shipment ={
                                id:e.id.value,
                                title:e.title,
                                description:e.description,
                                startLocation:startLocation,
                                endLocation:endLocation,
                                status:e.status,
                                shipmentDate:e.shipmentDate,
                                creationDate:e.creationDate,
                                cargo:cargo,
                                startLocationName:startLocationResponse.value?.locationName,
                                endLocationName:endLocationResponse.value?.locationName}

                  this.shipments.push(shipment)
                  console.log(shipment.startLocation.locationName);
                  
                    console.log(this.shipments)
                })

          })

        });


        
        
        
      });

      console.log(this.shipments);
      

    })
  }

  // getLocationInfo(latitude: number, longitude: number):any{
  //   const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`;
  //   this.http.get<any>(url).subscribe(
  //     (data) => {
  //       const info = data.address;
  //       console.log(info);
  
  //       let locationInfo: LocationInfomodel = {
  //         isoCode: info['ISO3166-2-lvl4'],
  //         city: info.city,
  //         country: info.country,
  //         state: info.state,
  //         lat: data.lat,
  //         lon: data.lon,
  //         country_code: info.country_code,
  //         postCode: info.postcode,
  //         suburb: info.Suburb,
  //         display_name: data.display_name,
  //         road: info.road,
  //         village: info.village,
  //         neighbourhood: info.neighbourhood,
  //         houseNumber: info.house_number
  //       };
  //       console.log(locationInfo);
  
  //       return locationInfo;
  //     },
  //     (error) => {
  //       console.error('Error getting location info:', error);

  //     }

      
  //   );
  // }

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
  
}
