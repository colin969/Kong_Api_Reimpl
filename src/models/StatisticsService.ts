import { IApiServices } from './ApiServices';
import { OpcodeEvent } from './enum';

export interface IStatsService {
  submit: (name: string, value: number) => void;
  submitArray: (messages: StatMessage[]) => void;
}

type StatMessage = {
  name: string;
  value: any;
}

export class StatsService implements IStatsService {
  constructor(private _services: IApiServices) {}

  submit(name: string, value: number) {
    console.log(`Stat Submit - ${name} - ${value}`);
    // Type safe against JS calls
    if (value === null || value === undefined || isNaN(value)) {
      return;
    }
    this._services.sendMessage({
      opcode: OpcodeEvent.OP_STATS_SUBMIT,
      params: {
        stats: [{
          name,
          value
        }]
      }
    });
  }

  submitArray(messages: StatMessage[]) {
    for (const m of messages) {
      this.submit(m.name, m.value);
    }
  }
}
