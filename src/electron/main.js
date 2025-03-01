const { app, BrowserWindow, screen, ipcMain, Menu, session  } = require('electron') 
const path = require('node:path');
const injectMeetingControls = require('./meeting-preload');

let primaryWindow;
let secondaryWindow;
let meetingWindow;

let primaryDisplay;
let secondaryDisplay;

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
    return win;

}

const createMeetingWindow = (display, url) => {
    const { x, y, width, height } = display.bounds;

    let normalizedUrl = url;
    if (url.includes('zoom.us')) {
        // Extract meeting ID and password (if present) from the original URL
        const urlObj = new URL(url);
        const meetingId = urlObj.pathname.split('/j/')[1]?.split('?')[0] || '';
        const pwd = urlObj.searchParams.get('pwd') || '';

        // Construct the web client URL
        normalizedUrl = `https://app.zoom.us/wc/${meetingId}/start?fromPWA=1`;
        if (pwd) {
            normalizedUrl += `&pwd=${encodeURIComponent(pwd)}`;
        }
    } else if (url.includes('teams.microsoft.com') || url.includes('teams.live.com')) {
        normalizedUrl = url; // Teams doesn’t need normalization
    }


    let win = new BrowserWindow({
        x,
        y,
        width, // Adjust the size as needed
        height,
        frame: true,
        kiosk: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true, 
            devTools: true,
            sandbox: true,
            webSecurity: true,
            partition: 'persist:meetings',
        },
    });

    const chromeUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
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

app.whenReady().then(() => {
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



//Listen for start-meeting events from frontend

ipcMain.on('start-meeting', (event, url)=>{
    if(primaryWindow){
        meetingWindow = createMeetingWindow(primaryDisplay, url)
    }
    if(secondaryWindow){
        secondaryWindow.loadFile(path.join(app.getAppPath(), '/dist/secondary.html'))   
    }
})

ipcMain.on('close-meeting', ()=>{
    if(secondaryWindow){
        secondaryWindow.loadFile(path.join(app.getAppPath(), '/dist/index.html'))
        if(meetingWindow) {
            console.log("ksndkcnajknasn")
            meetingWindow.close()
        }else{
            console.log("ksndkcnajknasn")
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
  if (process.platform !== 'darwin') {
    app.quit()
  }
})