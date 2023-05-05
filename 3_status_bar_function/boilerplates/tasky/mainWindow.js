const electron = require("electron");

class MainWindow extends electron.BrowserWindow {

    /** @param {{ width: number, height: number }} options  */
    constructor(traySize) {
        super({
            width: traySize.width,
            height: traySize.height,
            show: false,
            frame: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation:false,
                backgroundThrottling: false
            }
        });
        
        this.on('blur', this._onBlurHide.bind(this))
    }

    _onBlurHide() {
        this.hide();
    }
}


module.exports = {
    MainWindow
}