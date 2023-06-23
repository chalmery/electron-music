import {ipcMain} from "electron";
import dataEvent from "../../lib/event";
import localSetting from "../../lib/event";
import fs from "fs";
import path from "path";


const LrcAction = () => {
  ipcMain.on(dataEvent.LRC.value, (event, data) => {
    let picturePath = path.join(__dirname, '../' + data.hashCode + '.lrc')
    fs.readFile(picturePath, 'utf-8', (err, data) => {
      if (err) {
        console.log(err)
      }
      event.reply(localSetting.LRC_CALLBACK.value, data)
    })
  })
}


export {
  LrcAction
}