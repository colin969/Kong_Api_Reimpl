import { IKongregate, Kongregate } from './Kongregate';
import { MessageConnection } from './MessageConnection';

export interface IKongregateAPI {
  loadAPI: (cb: () => void) => void;
  getAPI: () => Kongregate;
  flashVarsString: () => string;
  flashVarsObject: () => URLSearchParams;
  getVariable: (key: string) => string | null;

  /** Intentionally public */
  _setGameSwf: (swfId: string) => void;

  messageConnection: MessageConnection | undefined;
}
export class KongregateAPI implements IKongregateAPI {

  private _gameSwf: any;
  private _kong: IKongregate;
  private _flashVars: URLSearchParams;

  public messageConnection: MessageConnection | undefined;

  constructor() {
    this.messageConnection = undefined;
    this._flashVars = new URL(window.location.href).searchParams;
    this._kong = new Kongregate(this._flashVars);
  }

  loadAPI(cb?: () => void) {
    console.debug('Kongregate API Loaded');
    if (cb) { cb(); }
    /** TODO */
  }

  getAPI() {
    console.debug('Kongregate API Fetched');
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

  _setGameSwf(swfId: string) {
    this._gameSwf = document.getElementById(swfId);
    if (!this.messageConnection) { this.messageConnection = new MessageConnection({
      target_origin: '', /** TODO */
      target_window: '', /** TODO */
      channel_id: this._flashVars.get('kongregate_channel_id') || '',
      retry_connection: true,
      websocket_url: this._flashVars.get('kongregate_websocket_url') || ''
    }); }
    /** Global reference to give to ExternalInterface */
    if (this._gameSwf) { this._gameSwf.setConnectionObject('kongregateAPI.messageConnection'); }
  }
}
