const { app, BrowserWindow, screen, ipcMain  } = require('electron') 
const path = require('node:path')

let primaryWindow;
let secondaryWindow;

const createWindow = (display, htmlPath) => {
    const { x, y, width, height } = display.bounds;

    let win = new BrowserWindow({
        x,
        y,
        width, // Adjust the size as needed
        height,
        fullscreen: true,
        // frame: false,
        // resizable: false,
        // kiosk:true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(app.getAppPath(), '/src/electron/preload.js')
        },
        
    });

    // win.loadURL('https://your-app-url-or-file.html');
    win.loadFile(htmlPath)
    // win.loadURL(path)
    win.maximize();
    return win;

}

app.whenReady().then(() => {
    // Menu.setApplicationMenu(null);

    const displays = screen.getAllDisplays()
    console.log(displays)

    const primaryDisplay = screen.getPrimaryDisplay(); // Get the main display
    console.log(primaryDisplay)
    const secondaryDisplay = displays.find(display => display.id !== primaryDisplay.id);

    primaryWindow = createWindow(primaryDisplay, path.join(app.getAppPath(), '/dist/index.html'));

    // Open window on the secondary display (if available)
    if (secondaryDisplay) {
        secondaryWindow = createWindow(secondaryDisplay, path.join(app.getAppPath(), '/dist/index.html'));
    } else {
        console.log("No secondary display detected.");
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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})