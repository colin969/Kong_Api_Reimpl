import React from 'react';
import { ProgressBar } from 'react-bootstrap';
import { IpcPlayerStats } from '../..';
import { GameAccomplishment, GameInfo, GameStatistic } from '../../types';

export type GameViewProps = {
  gameInfo?: GameInfo;
  player: IpcPlayerStats;
}

type GameViewState = {};

export class GameView extends React.Component<GameViewProps, GameViewState> {

  constructor(props: GameViewProps) {
    super(props);
    this.state = {};
  }

  render() {
    const { gameInfo } = this.props;
    if (gameInfo) {
      const achievements = this.renderAchievements();
      return (
        <div className='game'>
          <div className='game-id'>ID: {gameInfo.game_id}</div>
          <div className='game-path'>Path: {gameInfo.game_path}</div>
          <div className='game-achievements'>
            {achievements}
          </div>
        </div>
      );
    } else {
      return (
        <div>No Game Connected</div>
      );
    }
  }

  renderAchievements() {
    const { gameInfo } = this.props;
    if (gameInfo) {
      const achievements = gameInfo.achievements;
      return achievements.map((a, idx) => {
        const accomplishments = this.renderAccomplishments(a.accomplishment_tasks);
        return (
          <div key={idx} className='game-achievement'>
            <div className='game-achievement-banner'>
              <div className='game-achievement-badge-icon'>
                <img src={a.badge.icon_url}></img>
              </div>
              <div className='game-achievement-name'>{a.name}</div>
            </div>
            <div className='game-achievement-info'>
              <div className='game-achievement-description'>{a.badge.description}</div>
              <div className='game-achievement-level'>Difficulty: {a.level}</div>
              <div className='game-achievement-points'>Reward: {a.reward_points} points</div>
              <div className='game-achievement-accomplishments'>
                {accomplishments}
              </div>
            </div>
          </div>
        );
      });
    }
  }

  renderAccomplishments(accomplishments: GameAccomplishment[]) {
    const { gameInfo } = this.props;
    if (gameInfo) {
      return accomplishments.map((accomplishment: GameAccomplishment, idx) => {
        const linkedStat = gameInfo.statistics.find((stat) => stat.id === accomplishment.statistic_id);
        if (linkedStat) {
          const renderedValue = this.renderAccomplishmentValue(linkedStat, accomplishment);
          return (
            <div className='game-achievement-accomplishment' key={idx}>
              <div className='game-achievement-accomplishment-name'>{linkedStat.name} {'(' + linkedStat.stat_type + ')'}</div>
              <div className='game-achievement-accomplishment-description'>{linkedStat.description}</div>
              <div className='game-achievement-accomplishment-value'>
                {renderedValue}
              </div>
            </div>
          );
        }
        return (
          <></>
        );
      });
    }
  }

  renderAccomplishmentValue(linkedStat: GameStatistic, accomplishment: GameAccomplishment) {
    switch (linkedStat.stat_type) {
      case 'Max':
      case 'Add': {
        if (accomplishment.quota === 1) {
          return (
            <>
              <div className='game-achievement-accomplishment-flex'>
                <input
                  className='game-achievement-accomplishment-checkbox'
                  type='checkbox'
                  readOnly={true}
                  checked={this.props.player.stats[accomplishment.statistic_id] >= 1} />
                <div className='game-achievement-accomplishment-boolean-text'>{this.props.player.stats[accomplishment.statistic_id] >= 1 ? 'Achieved' : 'Unachieved'}</div>
              </div>
            </>
          );
        } else {
          return (
            <>
              <div>{Math.min(this.props.player.stats[accomplishment.statistic_id], accomplishment.quota)} of {accomplishment.quota}</div>
              <ProgressBar
                min={0}
                max={accomplishment.quota}
                now={Math.min(this.props.player.stats[accomplishment.statistic_id], accomplishment.quota)}/>
            </>
          );
        }
      }
      case 'Min':{
        return (<>
          <div>Best: {this.props.player.stats[accomplishment.statistic_id] < 0 ? 'None' : this.props.player.stats[accomplishment.statistic_id]}</div>
          <div>{'Target (Min): ' + accomplishment.quota}</div>
        </>
        );
      }
      default: {
        return (
          <div>Value: {this.props.player.stats[accomplishment.statistic_id] + ' - ' + accomplishment.quota}</div>
        );
      }
    }
  }
}
