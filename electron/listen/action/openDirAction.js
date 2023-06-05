import {dialog, ipcMain} from "electron";
import localSetting from "../../lib/event";
import {readSync, saveSync} from "../../lib/fs";
import {parseString} from "../../lib/utils";

function open() {
    let files = dialog.showOpenDialogSync({
        title: '选择文件路径',
        properties: ['openDirectory', 'multiSelections']
    })
    console.log(files)
    return files

}

function saveDir(files) {

    //1 先读取文件
    let historyDir = readSync('dirs')
    if (historyDir === null) {
        historyDir = '[]'
    }
    console.log('historyDir ' + historyDir)


    //2 拼接
    let historyDirJson = JSON.parse(historyDir)

    files.forEach((file) => {
        //不存在再push
        if (historyDirJson.indexOf(file) === -1) {
            historyDirJson.push(file)
        }
    })

    let dataStr = parseString(historyDirJson)

    //3 存储
    saveSync('dirs', dataStr)

    return historyDirJson;
}


//3 read callback
function callback(event, dataDir) {
    //发送消息，提示前端刷新
    event.reply(localSetting.DIR_DATA_CALLBACK.value, dataDir)
}


const openDirAction = () => {
    ipcMain.on(localSetting.OPEN_DIR.value, (event, data) => {
        console.log(data)
        //1 获取到选择的文件夹
        let files = open()
        if (files !== null && files !== undefined) {
            //2 保存
            let dataDir = saveDir(files)
            //3 回调
            callback(event, dataDir)
        }
    })
}


export {
    openDirAction
}