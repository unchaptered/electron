const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Tray } = electron;

const platform = process.platform;
if (platform === ('darwin' || 'win32')) return app.quit();

/** @type { Electron.BrowserWindow } */
let mainWindow;
let tray;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 300,
        height: 600,
        show: false,
        frame: false,
        resizable: false,
    });
    
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    const iconName = platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
    tray = new Tray(iconPath);

    tray.on('double-click', (event, bounds) => {
        
        const { x, y } = bounds
        const { width, height } = mainWindow.getBounds();

        mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show(); 
        mainWindow.setBounds({ x: x - width / 2, y: y - height, width, height });
    });

});