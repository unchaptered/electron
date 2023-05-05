const electron = require("electron");

class TimerBrowserWindow extends electron.BrowserWindow {

    /** @param { electron.BrowserWindowConstructorOptions | undefined } options  */
    constructor(options) {
        super(options);

        this.loadURL(`file://${__dirname}/src/index.html`)
        this.on('blur', this._onBlurHide.bind(this))
    }

    _onBlurHide() {
        this.hide();
    }
}


module.exports = {
    TimerBrowserWindow
}