import { plainToClass } from 'class-transformer';
import WebSocket from 'ws';
import { OpcodeEvent } from '../models/enum';
import { ParsedMessage } from '../models/MessageConnection';
import { registerHandlers } from './handlers';
import { GameAccomplishment, GameAchievement, GameInfo, MessageListenerFunc } from './types';
import * as fs from 'fs';
import * as path from 'path';

const wss = new WebSocket.Server({ port: 12345 });

wss.on('listening', () => {
  console.log('Websocket Opened');
});

wss.on('connection', function connection(ws) {
  const handlers = new Map<string, MessageListenerFunc>();

  console.log('Connection Established');
  ws.on('message', function incoming(message) {
    try {
      const msg: ParsedMessage = plainToClass(ParsedMessage, JSON.parse(message.toString())) as unknown as ParsedMessage;
      const opcodeKey = Object.keys(OpcodeEvent)[Object.values(OpcodeEvent).indexOf(msg.opcode)];
      console.log(`Event\tOPCODE:${msg.opcode} (${opcodeKey || 'unknown'})\n\tPARAMS:${JSON.stringify(msg.params)}`);
      if (msg.opcode === OpcodeEvent.CUSTOM_SETUP) {
        const { gameId, userId } = msg.params;

        let gameInfo: GameInfo | undefined;
        if (gameId) {
          // Load game info file
          const filePath = path.join(__dirname, '..', '..', 'static', 'game_info', `${gameId}.json`);
          const raw = fs.readFileSync(filePath).toString();
          gameInfo = parseGameInfo(raw);
          printGameInfo(gameInfo);
        }

        // Set up handlers
        registerHandlers(gameId || '0', userId || 'Guest', handlers);
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
    const ach: GameAchievement = {
      id: a.id,
      name: a.name,
      level: a.level,
      badge_id: a.badge_id,
      reward_points: a.reward_points,
      accomplishment_tasks: accomplishments
    };
    return ach;
  });

  return {
    game_id: data.game_id,
    game_path: data.game_path,
    multiplayer_game: data.multiplayer_game,
    achievements: achievements
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
