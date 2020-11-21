import { ApiServices, IApiServices } from "./ApiServices";

export interface IKongregate {
    services: IApiServices;
}

export class Kongregate implements IKongregate {

    public services: IApiServices;

    constructor(_kongvars: URLSearchParams) {
        this.services = new ApiServices(_kongvars);
    }
}