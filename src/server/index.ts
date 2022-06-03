import { plainToClass } from 'class-transformer';
import WebSocket from 'ws';
import { OpcodeEvent } from '../models/enum';
import { ParsedMessage } from '../models/MessageConnection';
import { registerHandlers } from './handlers';
import { Badge, GameAccomplishment, GameAccomplishmentStat, GameAchievement, GameInfo, GameStatistic, MessageListenerFunc } from './types';
import * as fs from 'fs';
import * as path from 'path';
import yargs from 'yargs';
import { startGui } from './gui';
import { IpcChannels } from './viewer/ipc';

// Load badges.json
const badges: Badge[] = [];
loadBadgeData(path.join(__dirname, '..', '..', 'static', 'badges.json'));

const wss = new WebSocket.Server({ port: 12345 });
let webContents: Electron.WebContents | undefined;

wss.on('listening', () => {
  console.log('Websocket Opened');
  setTimeout(async() => {
    const argv = await yargs(process.argv.slice(2)).options({
      gui: { type: 'boolean', default: false }
    }).parse();
    if (argv.gui) {
      startGui().then((wc) => {
        webContents = wc;
      });
    }
  }, 100);
});

wss.on('connection', (ws) => {
  const handlers = new Map<string, MessageListenerFunc>();
  const connState: ConnState = {
    player: {
      stats: {}
    },
    webContents
  };

  console.log('Connection Established');
  ws.on('message', (message) => {
    try {
      const msg: ParsedMessage = plainToClass(ParsedMessage, JSON.parse(message.toString())) as unknown as ParsedMessage;
      const opcodeKey = Object.keys(OpcodeEvent)[Object.values(OpcodeEvent).indexOf(msg.opcode)];
      console.log(`Event\tOPCODE:${msg.opcode} (${opcodeKey || 'unknown'})\n\tPARAMS:${JSON.stringify(msg.params)}`);
      if (msg.opcode === OpcodeEvent.CUSTOM_SETUP) {
        const { gameId } = msg.params;

        if (gameId) {
          // Load game info file
          const filePath = path.join(__dirname, '..', '..', 'static', 'game_info', `${gameId}.json`);
          const raw = fs.readFileSync(filePath).toString();
          connState.gameInfo = parseGameInfo(raw);
          printGameInfo(connState.gameInfo);
          if (connState.webContents) {
            // Load user info
            const saveFile = path.join(__dirname, '..', '..', 'data', gameId + '.json');
            try {
              const data = JSON.parse(fs.readFileSync(saveFile).toString());
              for (const s of data.stats) {
                connState.player.stats[s.id] = s.value;
              }
            } catch (err) {
              console.error('Error reading save file - ' + err);
            }
            const keys = Object.keys(connState.player.stats).map(Number);
            for (const stat of connState.gameInfo.statistics) {
              if (!keys.includes(stat.id)) {
                switch (stat.stat_type) {
                  case 'Min': {
                    connState.player.stats[stat.id] = -1;
                    break;
                  }
                  case 'Add':
                  case 'Replace':
                  case 'Max':
                  default:
                    connState.player.stats[stat.id] = 0;
                    break;
                }
              }
            }
            connState.webContents.send(IpcChannels.SET_GAME_INFO, connState.gameInfo, connState.player);
          }
        }

        // Set up handlers
        registerHandlers(connState, handlers);
      } else {
        const func = handlers.get(msg.opcode);
        if (func) {
          func(msg);
        } else {
          console.log(`Unimplemented Event: ${msg.opcode}`);
        }
      }
    } catch (err) {
      console.error(`Invalid Message: ${message} \nERR: ${err}`);
    }
  });
  ws.on('close', () => {
    console.log('Connection Closed');
  });
});
wss.on('close', () => {
  console.log('Websocket Closed');
});

function parseGameInfo(raw: any): GameInfo {
  const data = JSON.parse(raw);

  const statistics: GameStatistic[] = data.statistics.map((stat: any) => {
    const accomplishments: GameAccomplishmentStat[] = stat.accomplishment_tasks.map((t: any) => {
      const task: GameAccomplishmentStat = {
        id: t.id,
        name: t.name,
        quota: t.quota,
        granularity: t.granularity
      };
      return task;
    });
    const s: GameStatistic = {
      name: stat.name,
      id: stat.id,
      description: stat.description,
      stat_type: stat.stat_type,
      display_in_table: stat.display_in_table,
      accomplishment_tasks: accomplishments
    };
    return s;
  });

  const achievements: GameAchievement[] = data.achievements.map((a: any) => {
    console.log(JSON.stringify(a, undefined, 2));
    const accomplishments: GameAccomplishment[] = a.accomplishment_tasks.map((t: any) => {
      const task: GameAccomplishment = {
        id: t.id,
        statistic_id: t.statistic_id,
        quota: t.quota,
        granularity: t.granularity
      };
      return task;
    });
    const badge = badges[a.badge_id];
    const ach: GameAchievement = {
      id: a.id,
      name: a.name,
      level: a.level,
      badge: badge,
      reward_points: a.reward_points,
      accomplishment_tasks: accomplishments,
    };
    return ach;
  });
  console.log(path.join(__dirname));

  return {
    game_id: data.game_id,
    game_path: data.game_path,
    multiplayer_game: data.multiplayer_game,
    achievements: achievements,
    statistics: statistics,
  };
}

function printGameInfo(gameInfo: GameInfo) {
  console.log(`
Game ID:      ${gameInfo.game_id}
Game Path:    ${gameInfo.game_path}
Multiplayer:  ${gameInfo.multiplayer_game},
Achievements: ${gameInfo.achievements.map(a => {
    return `
\tID:     ${a.id}
\tName:   ${a.name}
\tLevel:  ${a.level}
\tPoints: ${a.reward_points}
    `;
  })}
  `);
}

function loadBadgeData(filepath: string) {
  const json = JSON.parse(fs.readFileSync(filepath).toString());

  for (const b of json) {
    const badge: Badge = {
      id: b.id,
      name: b.name,
      created_at: b.created_at,
      description: b.description,
      difficulty: b.difficulty,
      points: b.points,
      users_count: b.users_count,
      icon_url: b.icon_url
    };
    badges[badge.id] = badge;
  }
}

export type IpcPlayerStats = {
  stats: Record<number, number>
};

export type ConnState = {
  gameInfo?: GameInfo;
  player: IpcPlayerStats;
  webContents?: Electron.WebContents;
}
