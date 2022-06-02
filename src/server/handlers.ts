import { OpcodeEvent } from '../models/enum';
import { MessageListenerFunc } from './types';

export function registerHandlers(gameId: string, userId: string, m: Map<string, MessageListenerFunc>) {
  m.set(OpcodeEvent.OP_STATS_SUBMIT, (msg) => {
    console.log(JSON.stringify(msg));
    for (const stat of msg.params.stats) {
      console.log(`handling stat submit\n\tName: ${stat.name}\n\tValue: ${stat.name}`);
    }
  });
}
