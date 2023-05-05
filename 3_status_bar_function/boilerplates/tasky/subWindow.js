const { Menu, BrowserWindow } = require("electron");

class SubWindow extends BrowserWindow {

    /** @param {{ width: number, height: number }} options  */
    constructor(subTraySize) {
        super({
            title:'title',
            width: subTraySize.width,
            height: subTraySize.height,
            alwaysOnTop: true,
            closable: false,
            show: false,
            frame: false,
            transparent: true,
            hasShadow: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation:false
            }
        });

        this.setMenu(Menu.buildFromTemplate([]))

    }

}


module.exports = {
    SubWindow
}