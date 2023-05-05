const path = require('path');
const electron = require('electron');
const { app, BrowserWindow, Tray } = electron;

const platform = process.platform;
if (platform === ('darwin' || 'win32')) return app.quit();

/** @type { Electron.BrowserWindow } */
let mainWindow;
let tray;


/** @param { 'up-side' | 'down-side' | 'left-side' | 'right-side'} positionSide */
function getMockData(positionSide) {
    const width = 1920;
    const height = 1080;

    const taskBarDepth = 48;

    const map = {
        'up-side': {
            bounds: { width, height: 0 },
            workArea: { width, height: 0 + taskBarDepth }
        },
        'down-side': {
            bounds: { width, height },
            workArea: { width, height: height - taskBarDepth }
        },
        'left-side': {
            bounds: { width: 0, height: 0 },
            workArea: { width: 48, height: 0 }
        },
        'right-side': {
            bounds: { width, height: 0 },
            workArea: { width: width - taskBarDepth, height: 0 }
        }
    }

    const mapResult = map[positionSide];
    if (mapResult === undefined) {
        console.log("positionSide is must be 'up-side' | 'down-side' | 'left-side' | 'right-side'!!!");
        process.exit(1);
    }

    return mapResult;

}

/** @returns {{ positionSide: 'up-side' | 'down-side' | 'left-side' | 'right-side', workAreaWidth: number, workAreaHeight: number }} */
function getTaskBarPoisition() {
    const { screen } = electron;

    const displays = screen.getAllDisplays();
    const display = displays[0];

    const { bounds, workArea }= display;
    // const { bounds, workArea } = getMockData('right-side');

    const { width: boundsWidth, height: boundsHeight } = bounds;
    const { width: workAreaWidth, height: workAreaHeight } = workArea;

    /** @type { 'up-side' | 'down-side' | 'left-side' | 'right-side' } */
    let positionSide = 'down-side';
    if (boundsWidth !== workAreaWidth) positionSide = (boundsWidth > workAreaWidth) ? 'right-side' : 'left-side';
    if (boundsHeight !== workAreaHeight) positionSide = (boundsHeight < workAreaHeight) ? 'up-side' : 'down-side';

    return {
        positionSide,
        workAreaWidth,
        workAreaHeight
    }
}

/**
 * @param {{ positionSide: 'up-side' | 'down-side' | 'left-side' | 'right-side', workAreaWidth: number, workAreaHeight: number }} taskBarPosition
 * @param {{ x: number, y: number }}
 * @param {{ width: number, height: number }} traySize
 */
function getTrayPosition(taskBarPosition, mouseClickPosition, traySize) {

    // 테스크 바 위치와 작업 영역 크기
    const {
        positionSide,
        workAreaWidth,
        workAreaHeight
    } = taskBarPosition;

    // 상태 표시줄의 트레이 아이콘 위치
    const {
        x: mouseX,
        y: mouseY
    } = mouseClickPosition;

    // 트레이 크기
    const {
        width: trayWidth,
        height: trayHeight
    } = traySize;

    const map = {
        'up-side': {
            x: mouseX - trayWidth / 2,
            y: workAreaHeight + 5
        },
        'down-side': {
            x: mouseX - trayWidth / 2,
            y: workAreaHeight - trayHeight - 5
        },
        'left-side': {
            x: workAreaWidth,
            y: mouseY - trayHeight + 5
        },
        'right-side': {
            x: workAreaWidth - trayWidth,
            y: mouseY - trayHeight - 5,
        }
    }

    const mapResult = map[positionSide];
    if (mapResult === undefined) {
        console.log("positionSide is must be 'up-side' | 'down-side' | 'left-side' | 'right-side'!!!");
        if (app) app.close();
        process.exit(1);
    }

    return mapResult;

}

class TimerTray extends Tray {

    constructor(iconPath, taskBarPosition, traySize) {
        super(iconPath);

        this.on('double-click', (event, bounds) => {
            const { x, y } = getTrayPosition(taskBarPosition, bounds, traySize);
            const { width, height } = mainWindow.getBounds();
    
            mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
            mainWindow.setBounds({ x, y, width, height });
        });

    }

}

// const displays = screen.getAllDisplays();
app.on('ready', () => {

    const taskBarPosition = getTaskBarPoisition();
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

    new TimerTray(iconPath, taskBarPosition, traySize);

});