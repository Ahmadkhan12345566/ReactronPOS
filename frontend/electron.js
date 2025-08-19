import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, 
      contextIsolation: true,
    },
  });


  if (app.isPackaged) {
    // Load with hash root
    win.loadURL(`file://${path.join(__dirname, 'dist', 'index.html')}#/`);
  } else {
    // Load with hash root
    win.loadURL('http://localhost:5173/#/');
    win.webContents.openDevTools();
  }
  
  // Handle any failed navigation
  win.webContents.on('did-fail-load', (_, code, desc) => {
    if (app.isPackaged) {
      win.loadURL(`file://${path.join(__dirname, 'dist', 'index.html')}#/`);
    } else {
      win.loadURL('http://localhost:5173/#/');
    }
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});