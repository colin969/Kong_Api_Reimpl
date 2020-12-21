"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const types_1 = require("./types");
const ws_1 = __importDefault(require("ws"));
const wss = new ws_1.default.Server({ port: 12321 });
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log(message);
        const msg = class_transformer_1.plainToClass(types_1.ParsedMessage, JSON.parse(message.toString()));
        console.log(`OPCODE:${msg.opcode}\nPARAMS:${msg.params}`);
    });
});
