  
  declare global {
    interface Window {
      electronAPI: {
        ipcRenderer: {
          send: any
        }
        closeApp: () => void;
        startMeeting: (url: string) => void;
        teamsMeeting: (url: string, data: {}) => void;
        controlMeeting: (action: string) => void;
        closeMeeting: () => void;  // Ensure this is here
        navigateTo: (route) => void;
        getNetworkInfo: () => Promise<{ type: string; name: string }>;
        authGoogle: (url) => void;
        onUserEmail: (callback: (email: string) => void) => void;
        openKeyboard: () => void;
        setVolume: (volume) => void;
        getVolume: () => Promise;
        increaseVolume: () => void;
        decreaseVolume: () => void;
        moveMouse: (x, y) => void,
        mouseClick: (button) => void,
        toggleMute: () => void;
      };
    }
  }
  
  export {}; // Prevents this file from being treated as a script
  