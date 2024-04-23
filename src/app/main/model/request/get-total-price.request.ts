import { AddressModel } from "../address.model";

export interface GetTotalPriceRequest{
    cargoType:string,
    weight:number,
    startLocation:AddressModel,
    endLocation:AddressModel
}