import { ipcRenderer } from 'electron';
import React from 'react';
import { IpcPlayerStats } from '..';
import { GameInfo } from '../types';
import { GameView } from './components/GameView';
import { IpcChannels } from './ipc';
import 'bootstrap/dist/css/bootstrap.min.css';

export type AppProps = {};
export type AppState = {
  currentGame?: GameInfo;
  player: IpcPlayerStats;
}

export class App extends React.Component<AppProps, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      player: { stats: {} }
    };

    ipcRenderer.on(IpcChannels.SET_GAME_INFO, (event, gameInfo: GameInfo, stats: IpcPlayerStats) => {
      this.setState({ currentGame: gameInfo, player: stats });
    });

    ipcRenderer.on(IpcChannels.SET_STAT, (event, key, value) => {
      console.log(`key: ${key} value: ${value}`);
      const newStats = {...this.state.player};
      newStats.stats[key] = value;
      this.setState({ player: newStats });
    });
  }

  render() {
    return (
      <>
        <div>Game Viewer</div>
        <GameView gameInfo={this.state.currentGame} player={this.state.player}/>
      </>
    );
  }
}
