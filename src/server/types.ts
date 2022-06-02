import { ParsedMessage } from '../models/MessageConnection';

export type MessageListenerFunc = (message: ParsedMessage) => any;

export type GameInfo = {
  game_id: number;
  game_path: string;
  multiplayer_game: boolean;
  achievements: GameAchievement[];
}

export type GameAchievement = {
  id: number;
  name: string;
  badge_id: number;
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
