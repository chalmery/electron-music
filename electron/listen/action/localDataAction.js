import {ipcMain} from "electron";
import dataEvent from "../../lib/event";
import localSetting from "../../lib/event";
import {read} from "../../lib/fs";
import dataName from "../../lib/dataName";


const localDataAction = () => {
    ipcMain.on(dataEvent.LOCAL.value, (event, data) => {
        console.log("start")
        //查数据，组装格式
        read(dataName.META_DATA.value, (meta) => {
          if (meta !== undefined) {
            console.log(meta)
            event.reply(localSetting.LOCAL_CALLBACK.value, JSON.parse(meta))
          }
        })
    })
}


export {
    localDataAction
}