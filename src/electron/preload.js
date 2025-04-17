const { contextBridge, ipcRenderer } = require('electron/renderer') 

contextBridge.exposeInMainWorld('electronAPI', {
  closeApp: () => ipcRenderer.send('close-windows'),
  startMeeting: (url) => ipcRenderer.send('start-meeting', url),
  teamsMeeting: (url, data) => ipcRenderer.send('teams-meeting', url, data),
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
  setVolume: (volume) => ipcRenderer.invoke('set-volume', volume),
  getVolume: () => ipcRenderer.invoke('get-volume'),
  increaseVolume: () => ipcRenderer.invoke('increase-volume'),
  decreaseVolume: () => ipcRenderer.invoke('decrease-volume'),
  moveMouse: (x, y) => ipcRenderer.invoke('move-mouse', x, y),
  mouseClick: (button) => ipcRenderer.invoke('mouse-click', button),
  toggleMute: () => ipcRenderer.invoke("toggle-mute"),
})

ipcRenderer.on('fill-meeting-details', (event, { meetingId, passcode }) => {
  // Wait for the DOM to fully load and inputs to appear
  const tryInject = () => {
    // Find inputs by their labels or structure
    const inputs = document.querySelectorAll('.form-row input');
    if (inputs.length < 2) {
      console.log("Waiting for inputs to load...");
      return setTimeout(tryInject, 500);
    }

    const [meetingIdInput, passcodeInput] = inputs;

    meetingIdInput.value = meetingId;
    passcodeInput.value = passcode;

    // Fire events to simulate user input
    meetingIdInput.dispatchEvent(new Event('input', { bubbles: true }));
    passcodeInput.dispatchEvent(new Event('input', { bubbles: true }));

    // Optionally, submit the form
    const joinBtn = document.querySelector('button[type="submit"]');
    if (joinBtn) {
      setTimeout(() => joinBtn.click(), 500); // slight delay to simulate natural interaction
    } else {
      console.warn('Join button not found');
    }
  };

  tryInject();
});