import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetTotalPriceRequest } from "../model/request/get-total-price.request";
import { CreateShipmentRequest } from "../model/request/create-shipment.request";
import { GeneralResponse } from "src/app/share/Model/general.response";
import { environment } from "src/environment/environment";


@Injectable({
    providedIn :'root'
})

export class ShipmentService{


    private getTotalPrice:string  = `${environment.domain}/api/Shipment/GetTotalPrice`;
    private createShipment:string = `${environment.domain}/api/Shipment/CreateShipment`;
    private getAllShipments:string = `${environment.domain}/api/Shipment/GetAll`;
    private getSingleShipment:string = `${environment.domain}/api/Shipment/GetSingleShipment/`
    private acceptShipment:string = `${environment.domain}/api/Shipment/Accept/`;

    constructor(private http:HttpClient){}



    GetTotalPrice(request:GetTotalPriceRequest)
    {
        console.log(request);
        
        return this.http.post<number>(this.getTotalPrice ,request);
    }

    CreateShipment(request:CreateShipmentRequest)
    {
        return this.http.post<GeneralResponse<null>>(this.createShipment,request)
    }

    GetAllShipment(){
        return this.http.get<any>(this.getAllShipments);
    }

    GetSignleShipment(id:string)
    {
        return this.http.get<any>(this.getSingleShipment+id);
    }

    AcceptShipment(shipmentId:string)
    {
        return this.http.get<any>(this.acceptShipment+shipmentId);   
    }

}