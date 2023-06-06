import {ipcMain} from "electron";
import localSetting from "../../lib/event";
import {readdirSync, statSync} from "fs";

const {parseFile} = require('music-metadata');

const fileTypeList = ['FLAC', 'flac', 'MP3', 'mp3', 'ape', 'APE', 'MPEG']


//TODO 递归
function readDir(dir, fileMap) {
    try {
        let files = readdirSync(dir, 'utf-8')
        if (files === null || files === undefined) {
            return
        }
        files.forEach((file) => {
            let filePath = dir + "/" + file
            let info = statSync(filePath);
            if (info.isFile()) {
                fileMap.set(dir, filePath)
            } else {
                readDir(filePath, fileMap)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

/**
 * 获取文件夹下的文件
 * @param dirs
 * @returns {Map<String, String>}
 */
function batchReadDir(dirs) {
    //解析文件
    let fileMap = new Map()
    dirs.forEach((dir) => {
        readDir(dir, fileMap)
    })
    return fileMap;
}


function parseMetaData(fileMap) {
    const promises = [];
    fileMap.forEach((key, value) => {
        let promise = parseFile(value)
        promises.push(promise);
    })
    Promise.allSettled(promises).then((args) => {
        let metadataList = []
        for (let i = 0; i < args.length; i++) {
            let value = args[i].value;
            if (value !== undefined && fileTypeList.includes(value.format.container)) {
                let metadata = {
                    key: i,
                    title: value.common.title,
                    artist: value.common.artist,
                    album: value.common.album,
                    picture: null,
                    path: filePaths[i],
                    duration: value.format.duration,
                    type: value.format.container
                }
                if (value.common.picture !== undefined && value.common.picture.length !== 0) {
                    metadata.path = value.common.picture[0].data
                }
                metadataList.push(metadata)
            }
        }
    });
}


//同步数据
const dataSyncAction = () => {
    ipcMain.on(localSetting.SYNC_DATA.value, (event, data) => {
        //找这些目录的音乐
        let fileMap = batchReadDir(data)
        //解析元数据
        // parseMetaData(fileMap)
        //存储

    })
}

//解析文件对象
// async function getMetadata() {
//     const promises = [];
//     filePaths.forEach(filePath => {
//         promises.push(parseFile(filePath));
//     })
//     await Promise.allSettled(promises).then((args) => {
//         let metadataList = []
//         for (let i = 0; i < args.length; i++) {
//             let value = args[i].value;
//             if (value !== undefined && fileTypeList.includes(value.format.container)) {
//                 let metadata = {
//                     key: i,
//                     title: value.common.title,
//                     artist: value.common.artist,
//                     album: value.common.album,
//                     picture: null,
//                     path: filePaths[i],
//                     duration: value.format.duration,
//                     type: value.format.container
//                 }
//                 if (value.common.picture !== undefined && value.common.picture.length !== 0) {
//                     metadata.path = value.common.picture[0].data
//                 }
//                 metadataList.push(metadata)
//             }
//         }
//     });
// }


export {
    dataSyncAction
}