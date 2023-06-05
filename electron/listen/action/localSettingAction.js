import {ipcMain} from "electron";
import localSetting from "../../lib/event";
import {read} from "../../lib/fs";
import dataName from "../../lib/dataName";

function find(callback) {
    read(dataName.DIRS.value, callback)
}


const localSettingAction = () => {
    ipcMain.on(localSetting.LOCAL_CONF_INIT.value, (event, data) => {
        find((dataDir) => {
            if (dataDir !== null && dataDir !== undefined) {
                event.reply(localSetting.DIR_DATA_CALLBACK.value, JSON.parse(dataDir))
            }
        })
    })
}

export {
    localSettingAction
}