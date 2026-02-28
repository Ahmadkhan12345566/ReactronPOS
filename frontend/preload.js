const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  onBackendError: (callback) => ipcRenderer.on('backend-error', (_, err) => callback(err)),
  onBackendStarted: (callback) => ipcRenderer.on('backend-started', () => callback()),
  printReceipt: (data) => ipcRenderer.send('print-receipt', data),
  saveReport: (data) => ipcRenderer.invoke('save-report', data)
});