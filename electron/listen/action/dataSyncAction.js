import {ipcMain} from "electron";
import localSetting from "../../lib/event";
import {access, readdirSync, statSync, writeFile} from "fs";
import {save} from "../../lib/fs";
import dataName from "../../lib/dataName";
import path from "path";
import crypto from "crypto";
import mime from "mime-types";
import {makeGetRequest} from "../../lib/http";

const {parseFile} = require('music-metadata');

const fileTypeList = ['FLAC', 'flac', 'MP3', 'mp3', 'ape', 'APE', 'MPEG', 'Ogg']


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
                    filePath: filePath,
                    hashCode: crypto.createHash('md5').update(filePath).digest('hex')
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

function executeRequests(musicList, index, callback) {
    console.log(`调用接口开始 ${index}`)
    if (index >= musicList.length) {
        // 所有请求已执行完毕
        console.log(`所有请求已执行完毕`)
        callback()
        return;
    }
    const metadata = musicList[index];
    makeGetRequest(`https://music.163.com/api/search/get?s=${metadata.title}-${metadata.artist}&type=1&limit=1`)
      .then((data) => {
          let musicId = data?.result?.songs[0]?.id
          console.log(`调用网易接口完成 musicId ${musicId}`)
          if (musicId) {
              //调用接口获取歌词
              makeGetRequest(`https://music.163.com/api/song/lyric?id=${musicId}&lv=1&kv=1&tv=-1`)
                .then((data) => {
                    let lrc = data?.lrc?.lyric
                    if (lrc) {
                        let picturePath = path.join(__dirname, '../' + metadata.hashCode + '.lrc')
                        writeFile(picturePath, lrc, "utf-8", (err) => {
                            console.log(`调用接口完成 ${index}`)
                            // 递归调用，在指定的间隔后执行下一个请求
                            setTimeout(() => {
                                executeRequests(musicList, index + 1, callback);
                            }, 200);
                        })
                    } else {
                        // 递归调用，在指定的间隔后执行下一个请求
                        setTimeout(() => {
                            executeRequests(musicList, index + 1, callback);
                        }, 200);
                    }
                }).catch((error) => {
                  // 所有请求已执行完毕
                  console.log(`所有请求已执行完毕${error}`)
                  callback()
              })
          }
      })
      .catch((error) => {
          // 处理请求错误
          console.error(`Error executing request for URL: ${musicList}`, error);
          // 递归调用，在指定的间隔后执行下一个请求
          setTimeout(() => {
              executeRequests(musicList, index + 1, callback);
          }, 200);
      });
}

function savePicture(data, value, metadata, hashCode) {
    //存储二进制图片
    let picture = data.common.picture[0].data
    //获取文件后缀
    let imageMimeType = data.common.picture[0].format
    let format = mime.extension(imageMimeType)

    let picturePath = path.join(__dirname, '../' + hashCode + '.' + format)
    metadata.picture = picturePath

    //文件不存在则写入
    access(picturePath, (err) => {
        if (err) {
            writeFile(picturePath, picture, (err) => {
            })
        }
    })
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

    let musicList = []

    //循环解析音乐元数据
    fileList.forEach((value) => {
        let promise = parseFile(value.filePath)
        promise.then((data) => {
            if (data !== null && data !== undefined && fileTypeList.includes(data.format.container)) {
                let metadata = {
                    key: key,
                    title: data.common.title,
                    artist: data.common.artist,
                    album: data.common.album,
                    parentPath: value.dir,
                    picture: null,
                    path: value.filePath,
                    duration: formatTime(data.format.duration),
                    type: data.format.container,
                    hashCode: value.hashCode,
                }
                //保存图片
                if (data.common.picture !== undefined && data.common.picture.length !== 0) {
                    savePicture(data, value, metadata, value.hashCode);
                }
                musicList.push(metadata)
                metaList.push({key: value.dir, value: metadata})
            }
        }).catch((err) => {
            console.log(value);
            console.log(err)
        }).finally(() => {
            mapSize -= 1
            key += 1
            if (mapSize === 0) {
                //处理歌词
                executeRequests(musicList, 0, () => {
                    //回调前端
                    callback(metaList, event)
                })
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


function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds); // 取整数部分
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedMins = mins.toString().padStart(2, "0");
    const formattedSecs = secs.toString().padStart(2, "0");
    return `${formattedMins}:${formattedSecs}`;
}

export {
    dataSyncAction
}