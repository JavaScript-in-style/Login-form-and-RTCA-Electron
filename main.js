const {app, BrowserWindow} = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
    });

    win.loadURL('https://login-form-and-rtca-electron-production.up.railway.app');
}

app.whenReady().then(createWindow);