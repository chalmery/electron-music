import {dialog, ipcMain} from "electron";
import localSetting from "../../lib/event";
import {save} from "../../lib/fs";
import {parseString} from "../../lib/utils";

function open() {
    let files = dialog.showOpenDialogSync({
        title: '选择文件路径',
        properties: ['openDirectory', 'multiSelections']
    });
    console.log(files)
    return files;

}

function saveDir(files) {
    //空值处理
    let dataStr = files === null || files === undefined ? '[]' : parseString(files);
    save('dirs', dataStr);
}


const openDirAction = () => {
    ipcMain.on(localSetting.OPEN_DIR.value, (event, data) => {
        console.log(data)
        //1 dir
        let files = open()
        //2 save
        saveDir(files)

    })
}


export {
    openDirAction
}