const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo'
    });
    addWindow.loadURL(`file://${__dirname}/add.html`);
}

// Hoisting
const platform = process.platform;
if (platform === ('darwin' || 'win32')) app.quit();

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'quit',
                accelerator: platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

const nodeEnv = process.env.NODE_ENV
if (nodeEnv === ('production' || 'development' || 'staging' || 'test')) app.quit();
if (nodeEnv !== 'production') menuTemplate.push({
    label: 'View',
    submenu: [
        {
            label: 'Toggle Developer Tools',
            accelerator: platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }
    ]
})
