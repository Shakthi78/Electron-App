  
  declare global {
    interface Window {
      electronAPI: {
        closeApp: () => void;
        startMeeting: (url: string) => void;
        controlMeeting: (action: string) => void;
        closeMeeting: () => void;  // Ensure this is here
      };
    }
  }
  
  export {}; // Prevents this file from being treated as a script
  