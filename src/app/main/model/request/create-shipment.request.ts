import { AddressModel } from "../address.model";

export interface CreateShipmentRequest{
    cargoType:string,
    weight:number,
    startLocation:AddressModel,
    endLocation:AddressModel,
    title:string,
    description:string,
    shipmentDate:string,
    userId:string,
}