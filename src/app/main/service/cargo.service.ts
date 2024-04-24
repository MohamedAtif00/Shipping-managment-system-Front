import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environment/environment";


@Injectable({
    providedIn:'root'
})

export class CargoService{


    getSingleCargo:string = `${environment.domain}/api/Cargo/`;

    constructor(private http:HttpClient){}


    GetSingleCargo(id:string)
    {
        return this.http.get<any>(this.getSingleCargo+id);
    }
}