import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";



@Injectable({
    providedIn:'root'
})
export class AddressService{

    getSingleAddress:string = 'https://localhost:7001/api/Address/'

    constructor(private http:HttpClient){}

    GetSingleAddress(id:string)
    {
        return this.http.get<any>(this.getSingleAddress+id);
    }
}