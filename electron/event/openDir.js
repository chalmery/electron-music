// import {dialog, ipcMain} from "electron";
// import eventType from "../lib/event";
//
// ipcMain.on(eventType.OPEN_DIR.value, (event, data) => {
//     console.log(data)
//     openDir()
// })
//
//
// function openDir(){
//     let files = dialog.showOpenDialogSync({
//         title: '选择文件路径',
//         properties: ['openDirectory', 'multiSelections']
//     });
//     console.log(files)
//
// }