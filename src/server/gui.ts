import { app, BrowserWindow } from 'electron';
import * as path from 'path';

app.disableHardwareAcceleration();

export async function startGui() {
  return new Promise<Electron.WebContents>((resolve) => {
    const createWindow = () => {
      const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });

      win.webContents.openDevTools();
      win.loadFile(path.join(__dirname, '..', '..', 'static', 'www', 'index.html'));
      resolve(win.webContents);
    };

    app.whenReady().then(() => {
      createWindow();

    });
  });

}
