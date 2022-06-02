export interface Message {
  content: string;
  filter?: unknown;
  kv_params?: unknown;
}

export type SocketTemplate<T extends string, U extends { [key in T]: (...args: any[]) => any; }> = {
  [key in keyof U]: U[key];
}

export enum KongEvent {
  STATS_SUBMIT = 'stat.submit'
}

export type KongEventStats = {
  stats: Array<{value: any, name: string}>
}

export type KongEventTemplate = SocketTemplate<KongEvent, {
  [KongEvent.STATS_SUBMIT]: () => void;
}>;
