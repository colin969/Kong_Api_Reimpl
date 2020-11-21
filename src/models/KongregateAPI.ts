import { IKongregate, Kongregate } from "./Kongregate";

export interface IKongregateAPI {
    loadAPI: () => void;
    getAPI: () => Kongregate;
    flashVarsString: () => string;
    flashVarsObject: () => URLSearchParams;
    getVariable: (key: string) => string | null;
}
export class KongregateAPI implements IKongregateAPI {

    private _kong: IKongregate;
    private _flashVars: URLSearchParams;

    constructor() {
        this._flashVars = new URL(window.location.href).searchParams;
        this._kong = new Kongregate(this._flashVars);
    }

    loadAPI() {
        /** TODO */
    }

    getAPI() {
        return this._kong;
    }

    flashVarsString() {
        return this._flashVars.toString();
    }

    flashVarsObject() {
        return this._flashVars;
    }

    getVariable(key: string) {
        return this._flashVars.get(key);
    }
}