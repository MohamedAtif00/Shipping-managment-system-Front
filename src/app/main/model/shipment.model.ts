import { AddressModel } from "./address.model";
import { CargoModel } from "./cargo.model";

export interface ShipmentModel{
    title:string,
    description:string,
    status:string,
    shipmentDate:string,
    creationDate:string,
    startLocation:AddressModel,
    endLocation:AddressModel,
    cargo:CargoModel

}