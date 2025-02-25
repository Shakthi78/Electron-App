const { app, BrowserWindow, screen, ipcMain  } = require('electron') 
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
        },
    });

    win.loadURL(url) 
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

        meetingWindow.webContents.on('did-finish-load', () => {
            injectMeetingControls(meetingWindow.webContents);
        });
    
        meetingWindow.on('closed', () => {
            meetingWindow = null;
        });
    }
    if(secondaryWindow){
        secondaryWindow.loadFile(path.join(app.getAppPath(), '/dist/secondary.html'))   
    }
})

ipcMain.on('close-meeting', ()=>{
    if(secondaryWindow){
        if(meetingWindow) {
            meetingWindow.close()
        }
        secondaryWindow.loadFile(path.join(app.getAppPath(), '/dist/index.html'))
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
    if (meetingWindow) {
        meetingWindow.close();
    }
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