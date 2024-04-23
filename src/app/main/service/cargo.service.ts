import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
    providedIn:'root'
})

export class CargoService{


    getSingleCargo:string = 'https://localhost:7001/api/Cargo/';

    constructor(private http:HttpClient){}


    GetSingleCargo(id:string)
    {
        return this.http.get<any>(this.getSingleCargo+id);
    }
}