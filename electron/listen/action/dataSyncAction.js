import { ipcMain } from "electron";
import localSetting from "../../lib/event";
import { save, getPath, access, readdirSync, statSync } from "../../lib/fs";
import dataName from "../../lib/dataName";
import path from "path";
import crypto from "crypto";
import mime from "mime-types";
import { CharConstants } from "../../constants/constant";

const { parseFile } = require("music-metadata");

const fileTypeList = ["FLAC", "flac", "MP3", "mp3", "ape", "APE", "MPEG", "Ogg"];

function readDir(dir, fileList) {
  try {
    let files = readdirSync(dir);
    if (files === null || files === undefined) {
      return;
    }
    files.forEach((file) => {
      let filePath = path.join(dir, file);
      let info = statSync(filePath);
      if (info.isFile()) {
        fileList.push({
          dir: dir,
          filePath: filePath,
          hashCode: crypto.createHash("md5").update(filePath).digest("hex"),
        });
      } else {
        readDir(filePath, fileList);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * 获取文件夹下的文件
 * @param dirs
 */
function batchReadDir(dirs) {
  //解析文件
  let fileList = [];
  dirs.forEach((dir) => {
    readDir(dir, fileList);
  });
  return fileList;
}

function savePicture(data, value, metadata, hashCode) {
  //存储二进制图片
  let picture = data.common.picture[0].data;
  //获取文件后缀
  let imageMimeType = data.common.picture[0].format;
  let format = mime.extension(imageMimeType);

  let pictureName = hashCode + CharConstants.DOT + format;
  let picturePath = getPath(pictureName);
  metadata.picture = picturePath;

  //文件不存在则写入
  access(picturePath, (err) => {
    if (err) {
      save(pictureName, picture);
    }
  });
}

/**
 * 父级目录，文件路径
 * @param {[]} fileList 父级目录，文件信息对象{文件标题等}
 * @param callback function
 * @param event electron 事件
 */
function parseMetaData(fileList, callback, event) {
  if (fileList.length === 0) {
    //回调前端
    callback(fileList, event);
  }
  let metaList = [];
  let mapSize = fileList.length;
  let key = 1;

  let musicList = [];
  //循环解析音乐元数据
  fileList.forEach((value) => {
    let promise = parseFile(value.filePath);
    promise
      .then((data) => {
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
          };
          //保存图片
          if (data.common.picture !== undefined && data.common.picture.length !== 0) {
            savePicture(data, value, metadata, value.hashCode);
          }
          musicList.push(metadata);
          metaList.push({ key: value.dir, value: metadata });
        }
      })
      .catch((err) => {
        console.log(value);
        console.log(err);
      })
      .finally(() => {
        mapSize -= 1;
        key += 1;
        if (mapSize === 0) {
          //回调前端
          callback(metaList, event);
        }
      });
  });
}

/**
 * 存储
 * @param fileList
 * @param event
 */
function call(fileList, event) {
  if (fileList.length === 0) {
    event.reply(localSetting.SYNC_DATA_CALLBACK.value, localSetting.SYNC_DATA_CALLBACK.value);
    return;
  }
  const groupedArray = Object.values(
    fileList.reduce((acc, obj) => {
      const { key, value } = obj;
      if (!acc[key]) {
        acc[key] = { key: key, label: path.basename(key), value: [] };
      }
      acc[key].value.push(value);
      return acc;
    }, {})
  );
  //排序
  groupedArray.sort((a, b) => a.label.localeCompare(b.label));

  save(dataName.META_DATA.value, JSON.stringify(groupedArray), () => {
    event.reply(localSetting.SYNC_DATA_CALLBACK.value, localSetting.SYNC_DATA_CALLBACK.value);
  });
}

//同步数据
const dataSyncAction = () => {
  ipcMain.on(localSetting.SYNC_DATA.value, (event, data) => {
    if (data === undefined || data === null) {
      event.reply(localSetting.SYNC_DATA_CALLBACK.value, null);
      return;
    }
    //找这些目录的音乐
    let fileList = batchReadDir(data);
    // //解析元数据,存储
    parseMetaData(fileList, call, event);
  });
};

function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds); // 取整数部分
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedMins = mins.toString().padStart(2, "0");
  const formattedSecs = secs.toString().padStart(2, "0");
  return `${formattedMins}:${formattedSecs}`;
}

export { dataSyncAction };
