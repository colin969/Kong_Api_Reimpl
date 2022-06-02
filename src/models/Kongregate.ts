import { ApiServices, IApiServices } from './ApiServices';
import { IStatsService, StatsService } from './StatisticsService';

export interface IKongregate {
  services: IApiServices;
  stats: IStatsService;
}

export class Kongregate implements IKongregate {

  public services: IApiServices;
  public stats: IStatsService;

  constructor(_kongvars: URLSearchParams) {
    this.services = new ApiServices(_kongvars);
    this.stats = new StatsService(this.services);
  }

}
