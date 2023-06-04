import {ipcMain} from "electron";
import localSetting from "../../lib/event";

const openDirAction = () => {
    ipcMain.on(localSetting.OPEN_DIR.value, (event, data) => {
        console.log(data)
        //1 dir
        let files = open()
        //2 save
        saveDir(files)
        //3 callback
        event.reply(localSetting.LOCAL_DIR_SYNC.value,)
    })
}


export {
    openDirAction
}