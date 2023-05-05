const path = require('path');
const electron = require('electron');

const { app, ipcMain, BrowserWindow } = electron;

const { TimerTray } = require('./timerTray');
const { MainWindow } = require('./mainWindow');
const { SubWindow } = require('./subWindow');

const platform = process.platform;
if (platform === ('darwin' || 'win32')) return app.quit();

/** @type { MainWindow } */ let mainWindow;
/** @type { SubWindow } */ let subWindow;
/** @type { TimerTray } */ let timerTray;

app.on('ready', () => {

    if (platform === 'darwin') app.dock.hide();

    const traySize = { width: 300, height: 600 };
    mainWindow = new MainWindow(traySize);
    mainWindow.loadURL(`file://${__dirname}/src/index.html`);

    // const subWindow = new BrowserWindow({
    //     width: traySize.width,
    //     height: traySize.height,
    //     show: true,
    //     frame: false,
    //     resizable: false,
    // });
    const { screen } = require('electron');

    const displays = screen.getAllDisplays();
    const display = displays[0];
    const { workArea } = display;
    const { width: workAreaWidth, height: workAreaHeight } = workArea;

    const subTraySize = { width: 300, height: 50};

    console.log(workAreaWidth - subTraySize.width, workAreaHeight - subTraySize.height - 5);
    
    subWindow = new SubWindow(subTraySize);
    subWindow.loadURL(`file://${__dirname}/src/sub_index.html`);
    subWindow.setPosition(workAreaWidth - subTraySize.width, workAreaHeight - subTraySize.height - 5);
    subWindow.show();

    const iconName = platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
    const iconPath = path.join(__dirname, `./src/assets/${iconName}`); 
    timerTray = new TimerTray(iconPath, traySize, mainWindow);

});


ipcMain.on('update-timer', (event, timerLeftTime) => {
    console.log('야옹', timerLeftTime);
    subWindow.webContents.send('update-timer:preview', timerLeftTime);
});
