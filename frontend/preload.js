const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  printReceipt: (data) => ipcRenderer.send('print-receipt', data),
  saveReport: (data) => ipcRenderer.invoke('save-report', data)
});