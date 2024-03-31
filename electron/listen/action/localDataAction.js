import {ipcMain} from "electron";
import {eventName} from "../../lib/metadata/event";
import {read} from "../../lib/fs";
import {fileName} from "../../lib/metadata/metadata";


/**
 * 重新加载歌曲元数据
 */
const localDataAction = () => {
    ipcMain.on(eventName.LOCAL.value, (event, data) => {
        //查数据，组装格式
        read(fileName.META_DATA.value, (meta) => {
          if (meta !== undefined) {
            event.reply(eventName.LOCAL_CALLBACK.value, JSON.parse(meta))
          }
        })
    })
}


export {
    localDataAction
}