import {ipcMain} from "electron";
import localSetting from "../../lib/event";
import {readdirSync, statSync} from "fs";
import {save} from "../../lib/fs";
import dataName from "../../lib/dataName";

const {parseFile} = require('music-metadata');

const fileTypeList = ['FLAC', 'flac', 'MP3', 'mp3', 'ape', 'APE', 'MPEG', 'Ogg']


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


/**
 * 父级目录，文件路径
 * @param {*} fileMap 父级目录，文件信息对象{文件标题等}
 * @param callback function
 * @param event electron 事件
 */
function parseMetaData(fileMap, callback, event) {
    let metaMap = new Map();
    let mapSize = fileMap.size;
    fileMap.forEach((value, key) => {
        let promise = parseFile(value)
        promise.then((data) => {
            if (data !== null && data !== undefined && fileTypeList.includes(data.format.container)) {
                let metadata = {
                    title: data.common.title,
                    artist: data.common.artist,
                    album: data.common.album,
                    picture: null,
                    path: value,
                    duration: data.format.duration,
                    type: data.format.container
                }
                if (data.common.picture !== undefined && data.common.picture.length !== 0) {
                    metadata.picture = data.common.picture[0].data
                }
                metaMap.set(key, metadata)

            }
        }).finally(() => {
            mapSize -= 1
            if (mapSize === 0) {
                callback(metaMap, event)
            }
        })
    })
}


/**
 * 存储
 * @param metaMap
 * @param event
 */
function storage(metaMap, event) {
    save(dataName.META_DATA.value, JSON.stringify(Object.fromEntries(metaMap)), () => {
        console.log("回调开始")
        event.reply(localSetting.SYNC_DATA_CALLBACK.value, null)
    })
}

//同步数据
const dataSyncAction = () => {
    ipcMain.on(localSetting.SYNC_DATA.value, (event, data) => {
        //找这些目录的音乐
        let fileMap = batchReadDir(data)
        //解析元数据,存储
        parseMetaData(fileMap, storage, event)
    })
}

export {
    dataSyncAction
}