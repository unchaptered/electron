const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

// Hoisting
const platform = process.platform;
if (platform === ('darwin' || 'win32')) app.quit();

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo'
            },
            {
                label: 'quit',
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Command+Q';
                    } else {
                        return 'Ctrl+Q';
                    }
                })(),
                click() {
                    app.quit();
                }
            }
        ]
    }
];

// if (process.platform !== 'darwin') menuTemplate.shift();
