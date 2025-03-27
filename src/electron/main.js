const { app, BrowserWindow, screen, ipcMain, session, ipcRenderer } = require('electron') 
const path = require('node:path');
const injectMeetingControls = require('./meeting-preload');
const getNetworkInfo = require('./network');
const { exec } = require("child_process");

let primaryWindow;
let secondaryWindow;
let meetingWindow;

let primaryDisplay;
let secondaryDisplay;
let authWindow;

function openOnScreenKeyboard() {
  exec("osk", (error) => {
    if (error) {
      console.error("Failed to open keyboard:", error);
      return;
    }
  });
}

// Function to hide the taskbar
function hideTaskbar() {
  exec(`"${nircmdPath}" win hide class Shell_TrayWnd`, (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to hide taskbar:", error, stderr);
    } else {
      console.log("Taskbar hidden");
    }
  });
}

// Function to show the taskbar (optional, for cleanup on app exit)
function showTaskbar() {
  exec(`"${nircmdPath}" win show class Shell_TrayWnd`, (error, stdout, stderr) => {
    if (error) {
      console.error("Failed to show taskbar:", error, stderr);
    } else {
      console.log("Taskbar shown");
    }
  });
}

const createWindow = (display, htmlPath) => {
    const { x, y, width, height } = display.bounds;

    let win = new BrowserWindow({
      x,
      y,
      width, // Adjust the size as needed
      height,
      fullscreen: true,
      frame: false,
      kiosk: true,
      webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          devTools: true,
          preload: path.join(app.getAppPath(), '/src/electron/preload.js')
      },       
    });

    // win.loadURL('https://your-app-url-or-file.html');
    win.loadFile(htmlPath)
    // win.loadURL(path)
    // win.maximize();
    // Hide the taskbar when the window is created
    win.on('ready-to-show', () => {
      hideTaskbar();
    });

    // Ensure the window stays in kiosk mode
    win.on('leave-full-screen', () => {
      win.setKiosk(true);
      win.setFullScreen(true);
      hideTaskbar();
    });

    win.on('closed', () => {
      win = null;
    });

    return win;
}

const createMeetingWindow = (display, url) => {
    const { x, y, width, height } = display.bounds;

    let normalizedUrl = url;
    if(url.includes('app.zoom.us')){
        normalizedUrl = url
    }
    else if (url.includes('zoom.us')) {
        // Extract meeting ID and password (if present) from the original URL
        const urlObj = new URL(url);
        const meetingId = urlObj.pathname.split('/j/')[1]?.split('?')[0] || '';
        const pwd = urlObj.searchParams.get('pwd') || '';

        // Construct the web client URL
        normalizedUrl = `https://app.zoom.us/wc/${meetingId}/join`;
        if (pwd) {
            normalizedUrl += `?pwd=${encodeURIComponent(pwd)}`;
        }
    } else if (url.includes('teams.microsoft.com') || url.includes('teams.live.com')) {
        normalizedUrl = url; // Teams doesn’t need normalization
    }

    let win = new BrowserWindow({
        x,
        y,
        width, // Adjust the size as needed
        height,
        frame: false,
        kiosk: true,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true, 
          devTools: true,
          partition: 'persist:meetings',
        },
    });

    win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
      console.log(`Permission requested: ${permission}`);
      if (permission === "display-capture" || permission === 'media' || permission === 'camera' || permission === 'microphone' || permission === 'display-media') {
        console.log(`Granting permission: ${permission}`);
        callback(true);
      } else {
        console.log(`Denying permission: ${permission}`);
        callback(false);
      }
    });

    //This below code helps to prevent the meetings keep on loading.
    const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
    win.webContents.setUserAgent(chromeUserAgent);

    win.webContents.on('did-finish-load', () => {
      console.log('Page loaded:', win.webContents.getURL());
      injectMeetingControls(win.webContents);    
    });

    // Allow navigation within the app
    win.webContents.on('will-navigate', (event, navigationUrl) => {
      console.log(`Navigating to: ${navigationUrl}`);
    });

    // Open external links in default browser
    win.webContents.on('new-window', (event, newUrl) => {
      event.preventDefault();
      require('electron').shell.openExternal(newUrl);
    });

    // Debug loading issues
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error(`Failed to load ${validatedURL}: ${errorCode} - ${errorDescription}`);
    });

    win.on('closed', () => {
      win = null;
    });

    win.loadURL(normalizedUrl) 
    win.maximize()
    
    return win;
}

const createAuthWindow = (display, url)=>{
    const { x, y, width, height } = display.bounds;

    let win = new BrowserWindow({
        x,
        y,
        width,
        height,
        frame: true,
        kiosk: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true, 
            devTools: true,
            preload: path.join(app.getAppPath(), '/src/electron/preload.js')
        },
    })

    const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36';
    win.webContents.setUserAgent(chromeUserAgent);

    win.webContents.on('did-finish-load', async () => {
        const currentUrl = win.webContents.getURL();
        console.log('Page loaded:', currentUrl);

        if (currentUrl.startsWith('https://exceleed.in/api/v1/auth/redirect')) {
            try {
              // Execute JavaScript in the window to get the page content
              const content = await win.webContents.executeJavaScript('document.body.innerText');
              console.log('Raw content:', content);

                let data;
                try {
                data = JSON.parse(content);
                console.log('Parsed JSON:', data);
                } catch (parseError) {
                console.error('Failed to parse JSON:', parseError.message);
                return;
                }
      
              // Check if the response contains user data
                if (data.success && data.user) {
                    console.log("Sending email:", data.user);
                    if (secondaryWindow) {
                        console.log("🚀 Sending user email to secondary window:", data.user);
                        secondaryWindow.webContents.send('user-email', data.user);
                        primaryWindow.webContents.send('user-email', data.user);
                    } else {
                        console.log("🚀 Sending user email to primary window:", data.user);
                        primaryWindow.webContents.send('user-email', data.user);
                    }
                    win.close();
                } else {
                    console.error('Auth failed:', data.error, 'Details:', data.details);
                }
            } catch (error) {
              console.error('Error extracting content:', error.message);
            }
        }
    });

    // Allow navigation within the app
    win.webContents.on('will-navigate', (event, navigationUrl) => {
        console.log(`Navigating to: ${navigationUrl}`);
    });

    // Open external links in default browser
    win.webContents.on('new-window', (event, newUrl) => {
        event.preventDefault();
        require('electron').shell.openExternal(newUrl);
    });

    // Debug loading issues
    win.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
        console.error(`Failed to load ${validatedURL}: ${errorCode} - ${errorDescription}`);
    });

    win.on('closed', () => {
        win = null;
    });

    win.loadURL(url) 
    win.maximize()
    
    return win;
}


const loadRouteInWindow = (window, route) => {
    if (window) {
        const filePath = path.join(app.getAppPath(), '/dist/index.html');
        window.loadFile(filePath, { hash: route });
    }
};

app.whenReady().then(async() => {
    // Menu.setApplicationMenu(null);

    const displays = screen.getAllDisplays()
    console.log(displays)

    primaryDisplay = screen.getPrimaryDisplay(); // Get the main display
    console.log(primaryDisplay)
    secondaryDisplay = displays.find(display => display.id !== primaryDisplay.id);

    primaryWindow = createWindow(primaryDisplay, path.join(app.getAppPath(), '/dist/index.html'));

    // Open window on the secondary display (if available)
    if (secondaryDisplay) {
        secondaryWindow = createWindow(secondaryDisplay, path.join(app.getAppPath(), '/dist/index.html'));
    } else {
        console.log("No secondary display detected.");
    }
})

// IPC handlers
// ipcMain.on("increase-volume", () => increaseVolume());
// ipcMain.on("decrease-volume", () => decreaseVolume());
// ipcMain.on("set-volume", (event, volume) => setVolume(volume));
// ipcMain.handle("get-volume", () => getVolume());

// Path to nircmd.exe
const nircmdPath = path.join(__dirname, 'nircmd.exe');

// Handle setting the volume
ipcMain.handle('set-volume', async (_, volume) => {
  return new Promise((resolve, reject) => {
    const volumeValue = Math.round((volume / 100) * 65535); // Scale 0-100 to 0-65535
    const command = `"${nircmdPath}" setsysvolume ${volumeValue}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to set volume to ${volume}%:`, error, stderr);
        reject(error);
      } else {
        console.log(`Volume set to ${volume}%`);
        resolve();
      }
    });
  });
});

// Handle getting the volume
ipcMain.handle('get-volume', async () => {
  return new Promise((resolve, reject) => {
    console.log("nircmdPath", nircmdPath)
    exec(`powershell -command "Write-Output (New-Object -ComObject WMPlayer.OCX.7).settings.volume"`, (error, stdout) => {
      if (error) reject(error);
      else resolve(parseInt(stdout) || 50);
    });
  });
});

// Handle increasing/decreasing volume
ipcMain.handle('increase-volume', async () => {
  return new Promise((resolve, reject) => {
    const command = `"${nircmdPath}" changesysvolume +6553`; // ~5% increase (65535 / 20)
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Failed to increase volume:", error, stderr);
        reject(error);
      } else {
        console.log("Volume increased by 5%");
        resolve();
      }
    });
  });
});

ipcMain.handle('decrease-volume', async () => {
  return new Promise((resolve, reject) => {
    const command = `"${nircmdPath}" changesysvolume -6553`; // ~5% decrease
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Failed to decrease volume:", error, stderr);
        reject(error);
      } else {
        console.log("Volume decreased by 5%");
        resolve();
      }
    });
  });
});

//Open onScreen Keyboard
ipcMain.on("open-keyboard", ()=>{
    console.log("Open-keyboard")
    openOnScreenKeyboard()   
})

//Handle request for Googlr calendar authentication
ipcMain.on("authenticate-google", (event, url)=>{
    if(secondaryWindow){
       authWindow = createAuthWindow(secondaryDisplay, url)
    }
    else{
        authWindow = createAuthWindow(primaryDisplay, url)
    }
})

// Handle request from React to get network info
ipcMain.handle('get-network-info', async () => {
    return await getNetworkInfo()
  });

//Listen for navigation
ipcMain.on('navigate-to', (event, route)=>{
    if(route === route && secondaryWindow){
        loadRouteInWindow(secondaryWindow, route);
    }else if(primaryWindow){
        console.log("anksnklncask")
        loadRouteInWindow(primaryWindow, route)
    }
})


//Listen for start-meeting events from frontend

ipcMain.on('start-meeting', (event, url)=>{
    if(primaryWindow){
        meetingWindow = createMeetingWindow(primaryDisplay, url)
    }
    if(secondaryWindow){
        loadRouteInWindow(secondaryWindow, 'controls')
    }
})

ipcMain.on('close-meeting', ()=>{
    if(secondaryWindow){
        loadRouteInWindow(secondaryWindow, '/')
        try {
            if(meetingWindow) {
                console.log("ksndkcnajknasn")
                meetingWindow.close()
            }else{
                console.log("ksndkcnajknasn")
            } 
        } catch (error) {
            console.log("error in close meeting")
        }
        
    }
})

// Listen for close event from frontend
ipcMain.on('close-windows', () => {
    if (primaryWindow) {
        primaryWindow.close();
    }
    if (secondaryWindow) {
        secondaryWindow.close();
    }
    // if (meetingWindow) {
    //     meetingWindow.close();
    // }
});

ipcMain.on('meeting-control', (event, action) => {
    if (meetingWindow) {
        meetingWindow.webContents.executeJavaScript(`executeControl('${action}')`)
        .catch((err) => console.error('Control failed:', err));
    }
});

app.on('window-all-closed', () => {
  showTaskbar()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})