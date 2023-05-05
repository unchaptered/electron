const path = require('path');
const electron = require('electron');
const { app, BrowserWindow } = electron;

const { TimerTray } = require('./timerTray');

const platform = process.platform;
if (platform === ('darwin' || 'win32')) return app.quit();

/** @type { Electron.BrowserWindow } */
let mainWindow;
let timerTray;

// const displays = screen.getAllDisplays();
app.on('ready', () => {

    const traySize = { width: 300, height: 600 };
    mainWindow = new BrowserWindow({
        width: traySize.width,
        height: traySize.height,
        show: false,
        frame: false,
        resizable: false,
    });

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    const iconName = platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, `./src/assets/${iconName}`);

    // 변수에 할당되지 않은 클래스는 사라질 수 있음
    timerTray = new TimerTray(iconPath, traySize, mainWindow);

});