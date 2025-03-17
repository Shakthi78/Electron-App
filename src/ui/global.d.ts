  
  declare global {
    interface Window {
      electronAPI: {
        closeApp: () => void;
        startMeeting: (url: string) => void;
        controlMeeting: (action: string) => void;
        closeMeeting: () => void;  // Ensure this is here
        navigateTo: (route) => void;
        getNetworkInfo: () => Promise<{ type: string; name: string }>;
        authGoogle: (url) => void;
        onUserEmail: (callback: (email: string) => void) => void;
        openKeyboard: () => void;
      };
    }
  }
  
  export {}; // Prevents this file from being treated as a script
  