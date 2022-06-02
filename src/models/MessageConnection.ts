import { OpcodeEvent } from './enum';
import { PostMessage } from './PostMessage';

type MessageListener = (opcode: string, params: any) => void;

export const MESSAGE_EVENT = 'kongregate:api:message';

export class ParsedMessage {
  public origin?: unknown;
  public originalEvent?: unknown;
  public data?: unknown;
  constructor(
    public opcode: OpcodeEvent,
    public params: any
  ) {}
}

export interface IMessageConnection {
  isSupported(): boolean;
  connected(): boolean;
  isClient(): boolean;
  supportsObjects(): boolean;
  logPrefix(): string;
  addMessageListener(cb: MessageListener): void;
  listen(): Promise<void>;

  connect(): Promise<void>;
  retryConnection(): void;

  onMessageReceived(message: ParsedMessage): void;
  parseMessage(message: any): ParsedMessage | null;
  processMessage(message: ParsedMessage, c: unknown): void;
  sendMessage(opcode: OpcodeEvent, params: string[], onError?: () => void): void;

  onClientConnected: (b: unknown, c: unknown) => void;
  onConnectedToServer: () => void;
  acceptClientConnection: (a: unknown) => void;
  removeMissingWindows: (a: unknown) => void;
}

export type MessageConnectionConf = {
  target_window: any;
  target_origin?: string;
  channel_id: string;
  retry_connection?: boolean;
  websocket_url?: string;
}

export class MessageConnection implements IMessageConnection {

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

  async listen() {
    /** TODO */
    if (!this._ws) {
      // Set up WebSocket connection
      if (this._wsUrl) {
        console.debug(`Connecting to ${this._wsUrl}`);
        return new Promise<void>((resolve, reject) => {
          this._ws = new WebSocket(this._wsUrl);
          this._ws.onopen = () => {
            console.debug('WebSocket Established with Kong Server');
            resolve();
          };
          this._ws.onclose = () => {
            console.debug('WebSocket disconnected!');
            this._ws = undefined;
          };
          this._ws.onerror = () => {
            console.debug('WebSocket Error!');
            this._ws = undefined;
            reject();
          };
          this._ws.onmessage = this.parseMessage;

        });
      } else {
        console.debug('Cannot connect to WebSocket when websocket_url was not given in params!');
      }
    }
  }

  connected() {
    /** TODO */
    return this._ws ? this._ws.readyState === WebSocket.OPEN : false;
  }

  async connect() {
    if (!this.connected()) {
      await this.listen();
      this.sendMessage(OpcodeEvent.CONNECT, [], () => this.retryConnection());
      this.sendMessage(OpcodeEvent.CUSTOM_SETUP, {
        gameId: '17',
        userId: 'Guest'
      });
    }
  }

  retryConnection() {
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  isClient() {
    return this._isClient;
  }

  supportsObjects() {
    /** TODO */
    return true;
  }

  logPrefix() {
    return '[Game:JS]';
  }

  onMessageReceived(message: ParsedMessage) {
    /** TODO */
  }

  parseMessage(message: any) {
    /** TODO */
    console.debug(`Parsing Message: \n${message}`);
    try {
      const msg = PostMessage.parseMessage(message);
      if (msg && msg['opcode']) {
        return {
          opcode: msg['opcode'],
          params: msg['params']
        };
      }
    } catch (err) {
      console.warn(`${this.logPrefix()} - Error parsing message ${message} - ERR: ${err}`);
    }
    return null;
  }

  processMessage(message: ParsedMessage, c: unknown) {
    /** TODO */
  }

  sendMessage(opcode: OpcodeEvent, params: string[] | object, onError?: () => void) {
    /** TODO */
    if (this._ws) {
      try {
        console.debug(`Sending Message: \nOPCODE: ${opcode}\nPARAMS: ${params}`);
        const message = {opcode, params};
        this._ws.send(JSON.stringify(message));
      } catch (err) {
        console.error('Failed to send event - ' + err);
      }
    } else {
      console.warn('Cannot send messages when the websocket is not connected!');
    }
  }

  onClientConnected(b: unknown, c: unknown) {
    /** Stub */
  }

  onConnectedToServer() {
    /** Stub */
  }

  acceptClientConnection(a: unknown) {
    /** TODO */
  }

  removeMissingWindows(a: unknown) {
    /** TODO */
  }
}
