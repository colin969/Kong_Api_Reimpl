import { Message } from "./misc";

export interface IApiServices {
    isExternal: () => boolean;
    isKongregate: () => boolean;
    isConnected: () => boolean;
    initializeEventListeners: () => void;
    addEventListener: (event: string, listener: () => void) => void;
    getUsername: () => string;
    getUserID: () => number;
    getUserId: () => number;
    getGameID: () => number;
    getGameId: () => number;
    getGameAuthToken: () => string | null;
    isGuest: () => boolean;
    connect: () => void;
    connectExternal: () => void;
    sendMessage: (xmppMessage: unknown) => void;
    privateMessage: (message: string | Message, unknown: unknown) => void;
    resizeGame: (width: number, height: number) => void;
    showInvitationBox: (box: unknown, unknown: unknown) => void;
    showFeedPostBox: (message: string | Message, unknown: unknown) => void;
    showSignInBox: ()  => void;
    showRegistrationBox: () => void;
    showShoutBox: (message: string | Message, unknown: unknown) => void;
}

export class ApiServices implements IApiServices {
    
    private _isKong: boolean;
    private _username: string;
    private _userId: number;
    private _gameId: number;
    private _gameAuthToken: string | null;
    private _isGuest: boolean;

    constructor(private _kongVars: URLSearchParams) {
        this._isKong = true;
        this._username = _kongVars.get('kongregate_username') || 'Guest';
        this._userId = parseInt(_kongVars.get('kongregate_user_id') || '0');
        this._gameId = parseInt(_kongVars.get('kongregate_game_id') || '0');
        this._gameAuthToken = _kongVars.get('kongregate_game_auth_token');
        this._isGuest = !_kongVars.get('kongregate_username');
    }

    isExternal() {
        return !this._isKong;
    }

    isKongregate() {
        return this._isKong;
    }

    isConnected() {
        return true;
    }

    initializeEventListeners() {
        /** TODO */
    }

    addEventListener(event: string, listener: () => void) {
        /** TODO */
    }

    getUsername() {
        return this._username;
    }

    getUserID() {
        return this._userId;
    }

    getUserId() {
        return this.getUserID();
    }

    getGameID() {
        return this._gameId;
    }

    getGameId() {
        return this.getGameID();
    }

    getGameAuthToken() {
        return this._gameAuthToken;
    }

    connect() { /** Does Nothing */ }

    connectExternal() { /** Deprecated */ }

    sendMessage(xmppMessage: unknown) {
        /** TODO */
    }

    privateMessage(message: string | Message, unknown: unknown) {
        /** TODO */
    }

    resizeGame(width: number, height: number) {
        /** TODO */
    }

    showInvitationBox(box: unknown, unknown: unknown) {
        /** TODO */
    }

    showFeedPostBox(message: string | Message, unknown: unknown) {
        /** TODO */
    }

    showSignInBox() {
        /** TODO */
    }

    showRegistrationBox() {
        /** TODO */
    }

    showShoutBox() {
        /** TODO */
    }

    isGuest() {
        return this._isGuest;
    }
}