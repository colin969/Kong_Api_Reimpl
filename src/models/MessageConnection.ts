import { plainToClass } from 'class-transformer';

type MessageListener = (opcode: string, params: any) => void;

class ParsedMessage {
    public origin?: unknown;
    public originalEvent?: unknown;
    public data?: unknown;

    constructor(
        public opcode: string,
        public params: any
    ) {

    }
}

export interface IMessageConnection {
    isSupported(): boolean;
    connected(): boolean;
    isClient(): boolean;
    supportsObjects(): boolean;
    logPrefix(): string;
    addMessageListener(cb: MessageListener): void;
    listen(): void;

    connect(): void;
    retryConnection(): void;

    onMessageReceived(message: ParsedMessage): void;
    parseMessage(message: any): ParsedMessage;
    processMessage(message: ParsedMessage): void;
    sendMessage(opcode: string, params: string[]): void;
}

export type MessageConnectionConf = {
    target_window: any;
    target_origin: string | undefined;
    channel_id: string;
    retry_connection: boolean;
    websocket_url?: string;
}

export class MessageConnection implements IMessageConnection{
    
    private _ws: WebSocket | undefined;
    private _wsUrl: string;
    private _isClient: boolean;
    private _listeners: MessageListener[];
    
    constructor(conf: MessageConnectionConf) {
        this._isClient = typeof conf.target_origin === 'string';
        this._listeners = [];
        this._wsUrl = conf.websocket_url || '';
    }

    addMessageListener(cb: MessageListener) {
        this._listeners.push(cb);
    }

    isSupported() {
        /** TODO */
        return true;
    }

    listen() {
        /** TODO */
        if (!this._ws) {
            // Set up WebSocket connection
            if (this._wsUrl) {
                console.debug(`Connecting to ${this._wsUrl}`);
                this._ws = new WebSocket(this._wsUrl);
                this._ws.onopen = () => {
                    console.debug('WebSocket Established with Kong Server');
                };
                this._ws.onclose = () => {
                    console.debug('WebSocket disconnected!');
                    this._ws = undefined;
                };
                this._ws.onerror = () => {
                    console.debug('WebSocket Error!');
                    this._ws = undefined;
                };
                this._ws.onmessage = this.parseMessage;
            } else {
                console.debug('Cannot connect to WebSocket when websocket_url was not given in params!');
            }
        }
    }

    connected() {
        /** TODO */
        return true;
    }

    connect() {
        /** TODO */
    }

    retryConnection() {
        /** TODO */
    }

    isClient() {
        return this._isClient;
    }

    supportsObjects() {
        /** TODO */
        return true;
    }

    logPrefix() {
        return "[Game:JS]";
    }

    onMessageReceived(message: ParsedMessage) {
        /** TODO */
    }

    parseMessage(message: MessageEvent<any>) {
        /** TODO */
        console.debug(`Parsing Message: \n${message}`);
        const msg = plainToClass(ParsedMessage, message.data);
        return msg[0];
    }

    processMessage(message: ParsedMessage) {
        /** TODO */
    }

    sendMessage(opcode: string, params: string[]) {
        /** TODO */
        if (this._ws) {
            console.debug(`Sending Message: \nOPCODE: ${opcode}\nPARAMS: ${params}`);
            const message = new ParsedMessage(opcode, params);
            this._ws.send(JSON.stringify(message));
        } else {
            console.warn('Cannot send messages when the websocket is not connected!');
        }
    }
}