import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function startBackendServer() {
  const backendPath = app.isPackaged
    ? path.join(process.resourcesPath, 'backend', 'src', 'index.js') // In packaged app
    : path.join(__dirname, '..', 'backend', 'src', 'index.js');      // In dev mode

  try {
    const backend = await import(pathToFileURL(backendPath).href);
    await backend.startServer();
  } catch (err) {
    console.error('Failed to start backend:', err);
    throw err;
  }
}
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Open devtools in dev for quick debugging
  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: 'detach' });
  }

  // Try to load the appropriate URL immediately
  if (app.isPackaged) {
    // packaged: load index.html from dist
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    win.loadURL(pathToFileURL(indexPath).href).catch(err => {
      console.error('Failed to load packaged index.html:', err);
    });
  } else {
    // dev: vite dev server
    win.loadURL('http://localhost:5173/#/').catch(err => {
      console.error('Failed to load dev server URL:', err);
    });
  }

  // fallback / more helpful logging if load fails
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    console.error('did-fail-load', { errorCode, errorDescription, validatedURL, isMainFrame });
    // Try a fallback attempt (only if appropriate)
    if (!app.isPackaged) {
      // sometimes a race: wait and retry
      setTimeout(() => win.loadURL('http://localhost:5173/#/'), 500);
    } else {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      win.loadURL(pathToFileURL(indexPath).href).catch(e => console.error(e));
    }
  });

  // helpful events to catch renderer crashes
  win.webContents.on('crashed', () => {
    console.error('Renderer crashed');
  });
  win.on('unresponsive', () => {
    console.error('Window unresponsive');
  });
}



// Handle app events
app.whenReady().then(()=> {
  startBackendServer().then(() => {
    console.log('Backend server started successfully');
    createWindow();
  }).catch(err => {
    console.error('Failed to start backend:', err);
    const win = createWindow();

     win.webContents.once('did-finish-load', () => {
      win.webContents.executeScript(`
        alert('Backend failed to start: ${err.message}');
      `);
      win.webContents.send('backend-error', err.message || 'Unknown error');
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});