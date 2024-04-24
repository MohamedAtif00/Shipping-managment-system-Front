import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";



@Injectable({
    providedIn:'root'
})
export class AddressService{

    getSingleAddress:string = `${environment.domain}/api/Address/`;

    constructor(private http:HttpClient){}

    GetSingleAddress(id:string)
    {
        return this.http.get<any>(this.getSingleAddress+id);
    }
}