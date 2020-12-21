import { plainToClass } from 'class-transformer';
import { ParsedMessage } from './types';
import WebSocket from 'ws';
 
const wss = new WebSocket.Server({ port: 12321 });
 
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log(message);
    const msg: ParsedMessage = plainToClass(ParsedMessage, JSON.parse(message.toString())) as unknown as ParsedMessage;
    console.log(`OPCODE:${msg.opcode}\nPARAMS:${msg.params}`);
  });
});