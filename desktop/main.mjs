import { app, BrowserWindow, ipcMain, shell } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.AGIGOV_DESKTOP_DEV === '1';

/** @type {BrowserWindow | null} */
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: 'AGIGOV',
    backgroundColor: '#fafafa',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('agigov:open-external', (_event, url) => {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return false;
  void shell.openExternal(url);
  return true;
});

ipcMain.handle('agigov:get-meta', () => ({
  desktop: true,
  platform: process.platform,
  arch: process.arch,
  versions: {
    app: app.getVersion(),
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
}));
