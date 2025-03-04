const { contextBridge, ipcRenderer } = require('electron/renderer') 

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-windows'),
  startMeeting: (url) => ipcRenderer.send('start-meeting', url),
  controlMeeting: (action) => ipcRenderer.send('meeting-control', action),
  closeMeeting: () => ipcRenderer.send('close-meeting'),
  navigateTo: (route) => ipcRenderer.send("navigate-to", route),
  getNetworkInfo: () => ipcRenderer.invoke("get-network-info"),
  saveClose: (route) => ipcRenderer.send("save-and-close", route)
})