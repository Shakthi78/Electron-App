const { contextBridge, ipcRenderer } = require('electron/renderer') 

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-windows'),
  startMeeting: (url) => ipcRenderer.send('start-meeting', url),
  controlMeeting: (action) => ipcRenderer.send('meeting-control', action),
  closeMeeting: () => ipcRenderer.send('close-meeting'),
  navigateTo: (route) => ipcRenderer.send("navigate-to", route),
  getNetworkInfo: () => ipcRenderer.invoke("get-network-info"),
  authGoogle: (url) => ipcRenderer.send("authenticate-google", url),

  onUserEmail: (callback) => {
    console.log("👀 Registered user-email listener in preload.js");
    ipcRenderer.on('user-email', (event, userData) => {
      console.log("📩 Received user email in preload.js:", userData);
      callback(userData);
    });
  },
  openKeyboard: () => ipcRenderer.send('open-keyboard'),
  moveMouse: (deltaX, deltaY) => ipcRenderer.send("move-mouse", deltaX, deltaY),
})