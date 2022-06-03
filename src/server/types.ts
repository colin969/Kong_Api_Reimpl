import { ConnState } from '.';
import { ParsedMessage } from '../models/MessageConnection';

export type MessageListenerFunc = (message: ParsedMessage) => any;

export type GameInfo = {
  game_id: number;
  game_path: string;
  multiplayer_game: boolean;
  achievements: GameAchievement[];
  statistics: GameStatistic[];
}

export type GameAchievement = {
  id: number;
  name: string;
  badge: Badge;
  level: 'easy' | 'medium' | 'hard' | 'impossible';
  reward_points: number;
  accomplishment_tasks: GameAccomplishment[];
}

export type GameAccomplishment = {
  id: number;
  statistic_id: number;
  quota: number;
  granularity: number;
}

export type Badge = {
  id: number;
  name: string;
  created_at: string;
  icon_url: string;
  points: number;
  difficulty: string;
  description: string;
  users_count: string;
}

export type GameStatistic = {
  name: string;
  id: number;
  description: string;
  stat_type: 'Add' | 'Min' | 'Max' | 'Replace';
  display_in_table: boolean;
  accomplishment_tasks: GameAccomplishmentStat[];
}

export type GameAccomplishmentStat = {
  id: number;
  name: string;
  quota: number;
  granularity: number;
}
