const { contextBridge, ipcRenderer } = require('electron/renderer') 

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-windows')
})