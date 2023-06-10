import {ipcMain} from "electron";
import dataEvent from "../../lib/event";


const localDataAction = () => {
    ipcMain.on(dataEvent.LOCAL.value, (event, data) => {
        console.log(data)
    })
}


export {
    localDataAction
}