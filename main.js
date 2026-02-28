const {app, BrowserWindow} = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
    });

    win.loadURL('https://rtca.up.railway.app');
}

app.whenReady().then(createWindow);

win.webContents.openDevTools();