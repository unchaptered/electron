const { Tray, Menu, app } = require('electron');


class TimerTray extends Tray {

    /**
     * @param { string } iconPath 
     * @param {{ width: number, height: number }} traySize 
     * @param { Electron.BrowserWindow } mainWindow 
     */
    constructor(iconPath, traySize, mainWindow) {
        super(iconPath);

        this.traySize = traySize;
        this.mainWindow = mainWindow;

        this.setToolTip('Timer App');

        // 이 구문은 binding이 풀려서 가비지 컬랙터가 앱을 꺼버립니다.
        // this.on('double-click', this._onClickShowAndHide);
        this.on('double-click', this._onClick_ShowAndHide.bind(this));
        this.on('right-click', this._onClick_ShowTrayOption.bind(this));

    }

    _onClick_ShowTrayOption() {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: 'Quit',
                click: () => app.quit()
            }
        ])

        this.popUpContextMenu(menuConfig);
    }

    _onClick_ShowAndHide(event, bounds) {

        const taskBarPosition = this.getTaskBarPoisition();

        const { x, y } = this.getTrayPosition(taskBarPosition, bounds, this.traySize);

        const { width, height } = this.mainWindow.getBounds();

        this.mainWindow.isVisible() ? this.mainWindow.hide() : this.mainWindow.show();
        this.mainWindow.setBounds({ x, y, width, height });
        
    }

    /** @param { 'up-side' | 'down-side' | 'left-side' | 'right-side'} positionSide */
    _getMockData(positionSide) {
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
    getTaskBarPoisition() {
        const { screen } = require('electron');

        const displays = screen.getAllDisplays();
        const display = displays[0];

        const { bounds, workArea } = display;
        // const { bounds, workArea } = this._getMockData('right-side');

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
    getTrayPosition(taskBarPosition, mouseClickPosition, traySize) {

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

}

module.exports = {
    TimerTray
}