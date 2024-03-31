import {ipcMain} from "electron";
import {eventName} from "../../lib/metadata/event";
import {read,save} from "../../lib/fs";
import {fileName} from "../../lib/metadata/metadata";

function find(callback) {
    read(fileName.DIRS.value, callback)
}


const localSettingAction = () => {
    //本地文件夹读取
    ipcMain.on(eventName.LOCAL_CONF_INIT.value, (event, data) => {
        find((dataDir) => {
            if (dataDir !== null && dataDir !== undefined) {
                event.reply(eventName.DIR_DATA_CALLBACK.value, JSON.parse(dataDir))
            }
        })
    })
    //文件夹更新
    ipcMain.on(eventName.UPDATE_DIR.value, (event, data) => {
        save(fileName.DIRS.value,JSON.stringify(data),() => {
            event.reply(eventName.UPDATE_DIR_CALLBACK.value, eventName.UPDATE_DIR_CALLBACK.value)
        })
    })
}

export {
    localSettingAction
}