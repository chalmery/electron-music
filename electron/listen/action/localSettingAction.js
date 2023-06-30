import {ipcMain} from "electron";
import localSetting from "../../lib/event";
import {read,save} from "../../lib/fs";
import dataName from "../../lib/dataName";

function find(callback) {
    read(dataName.DIRS.value, callback)
}


const localSettingAction = () => {
    //本地文件夹读取
    ipcMain.on(localSetting.LOCAL_CONF_INIT.value, (event, data) => {
        find((dataDir) => {
            if (dataDir !== null && dataDir !== undefined) {
                event.reply(localSetting.DIR_DATA_CALLBACK.value, JSON.parse(dataDir))
            }
        })
    })
    //文件夹更新
    ipcMain.on(localSetting.UPDATE_DIR.value, (event, data) => {
        save(dataName.DIRS.value,JSON.stringify(data),() => {
            event.reply(localSetting.UPDATE_DIR_CALLBACK.value, localSetting.UPDATE_DIR_CALLBACK.value)
        })
    })
}

export {
    localSettingAction
}