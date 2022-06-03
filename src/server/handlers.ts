import { ConnState } from '.';
import { OpcodeEvent } from '../models/enum';
import { MessageListenerFunc } from './types';
import { IpcChannels } from './viewer/ipc';

export function registerHandlers(connState: ConnState, m: Map<string, MessageListenerFunc>) {
  m.set(OpcodeEvent.OP_STATS_SUBMIT, (msg) => {
    console.log(JSON.stringify(msg));
    for (const stat of msg.params.stats) {
      if (connState.gameInfo) {
        const s = connState.gameInfo.statistics.find(s => s.name === stat.name);
        if (s) {
          console.log('Found Stat ' + s.id);
          console.log('Current Value ' + connState.player.stats[s.id]);
          // Force a positive integer
          stat.value = Math.max(stat.value, 0);
          switch (s.stat_type) {
            case 'Add':
              connState.player.stats[s.id] = connState.player.stats[s.id] + stat.value;
              break;
            case 'Max':
              connState.player.stats[s.id] = Math.max(connState.player.stats[s.id], stat.value);
              break;
            case 'Replace':
              connState.player.stats[s.id] = stat.value;
              break;
            case 'Min':
              if (connState.player.stats[s.id] < 0) {
                connState.player.stats[s.id] = stat.value;
              } else {
                connState.player.stats[s.id] = Math.min(connState.player.stats[s.id], stat.value);
              }
              break;
          }
          if (connState.webContents) {
            connState.webContents.send(IpcChannels.SET_STAT, s.id, connState.player.stats[s.id]);
          }
        } else {
          console.log(`Stat not found for '${stat.name}'`);
        }
      }
    }
  });
}
