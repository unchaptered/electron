const path = require('path');
const electron = require('electron');
const { app } = electron;

const { TimerTray } = require('./timerTray');
const { MainWindow } = require('./mainWindow');

const platform = process.platform;
if (platform === ('darwin' || 'win32')) return app.quit();

let mainWindow;
let timerTray;

app.on('ready', () => {

    if (platform === 'darwin') app.dock.hide();

    const traySize = { width: 300, height: 600 };
    mainWindow = new MainWindow(traySize)
    mainWindow.loadURL(`file://${__dirname}/src/index.html`)
    
    const iconName = platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, `./src/assets/${iconName}`); 
    timerTray = new TimerTray(iconPath, traySize, mainWindow);

});