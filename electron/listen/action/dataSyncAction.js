import {ipcMain} from "electron";
import localSetting from "../../lib/event";
import {readdirSync, statSync} from "fs";
import {save} from "../../lib/fs";
import dataName from "../../lib/dataName";
import path from "path";

const {parseFile} = require('music-metadata');

const fileTypeList = ['FLAC', 'flac', 'MP3', 'mp3', 'ape', 'APE', 'MPEG', 'Ogg']


//TODO 递归
function readDir(dir, fileList) {
    try {
        let files = readdirSync(dir, 'utf-8')
        if (files === null || files === undefined) {
            return
        }
        files.forEach((file) => {
            let filePath = path.join(dir, file)
            let info = statSync(filePath);
            if (info.isFile()) {
                fileList.push({
                    dir: dir,
                    filePath: filePath
                })
            } else {
                readDir(filePath, fileList)
            }
        })
    } catch (err) {
        console.log(err)
    }
}

/**
 * 获取文件夹下的文件
 * @param dirs
 */
function batchReadDir(dirs) {
    //解析文件
    let fileList = []
    dirs.forEach((dir) => {
        readDir(dir, fileList)
    })
    return fileList;
}


/**
 * 父级目录，文件路径
 * @param {[]} fileList 父级目录，文件信息对象{文件标题等}
 * @param callback function
 * @param event electron 事件
 */
function parseMetaData(fileList, callback, event) {
    let metaList = []
    let mapSize = fileList.length
    let key = 1
    fileList.forEach((value) => {
        let promise = parseFile(value.filePath)
        promise.then((data) => {
            if (data !== null && data !== undefined && fileTypeList.includes(data.format.container)) {
                let metadata = {
                    key: key,
                    title: data.common.title,
                    artist: data.common.artist,
                    album: data.common.album,
                    picture: null,
                    path: value.filePath,
                    duration: data.format.duration,
                    type: data.format.container
                }
                // if (data.common.picture !== undefined && data.common.picture.length !== 0) {
                //     metadata.picture = data.common.picture[0].data
                // }
                metaList.push({
                    key: value.dir,
                    value: metadata
                })
            }
        }).catch((err) => {
            console.log(err.message)
        }).finally(() => {
            mapSize -= 1
            key += 1
            if (mapSize === 0) {
                callback(metaList, event)
            }
        })
    })
}


/**
 * 存储
 * @param fileList
 * @param event
 */
function call(fileList, event) {
    const groupedArray = Object.values(fileList.reduce((acc, obj) => {
        const {key, value} = obj;
        if (!acc[key]) {
            acc[key] = {key: key, label: path.basename(key), value: []};
        }
        acc[key].value.push(value);
        return acc;
    }, {}));
    //排序
    groupedArray.sort((a, b) => a.label.localeCompare(b.label));

    save(dataName.META_DATA.value, JSON.stringify(groupedArray), () => {
        event.reply(localSetting.SYNC_DATA_CALLBACK.value, localSetting.SYNC_DATA_CALLBACK.value)
    })
}

//同步数据
const dataSyncAction = () => {
    ipcMain.on(localSetting.SYNC_DATA.value, (event, data) => {
        if (data === undefined || data === null) {
            event.reply(localSetting.SYNC_DATA_CALLBACK.value, null)
            return
        }
        //找这些目录的音乐
        let fileList = batchReadDir(data)
        // //解析元数据,存储
        parseMetaData(fileList, call, event)
    })
}

export {
    dataSyncAction
}