import { ipcMain } from "electron";
import {eventName} from "../../lib/metadata/event";
import { save, access, readdirSync, statSync } from "../../lib/fs";
import {fileName, fileTypeList, getPath} from "../../lib/metadata/metadata";
import path from "path";
import mime from "mime-types";
import { CharConstants } from "../../constants/constant";
import {formatTime, getMd5Value} from "../../lib/util/utils";

const { parseFile } = require("music-metadata");

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
          hashCode: getMd5Value(filePath),
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
    event.reply(eventName.SYNC_DATA_CALLBACK.value, eventName.SYNC_DATA_CALLBACK.value);
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

  save(fileName.META_DATA.value, JSON.stringify(groupedArray), () => {
    event.reply(eventName.SYNC_DATA_CALLBACK.value, eventName.SYNC_DATA_CALLBACK.value);
  });
}

//同步数据
const dataSyncAction = () => {
  ipcMain.on(eventName.SYNC_DATA.value, (event, data) => {
    if (data === undefined || data === null) {
      event.reply(eventName.SYNC_DATA_CALLBACK.value, null);
      return;
    }
    //找这些目录的音乐
    let fileList = batchReadDir(data);
    // //解析元数据,存储
    parseMetaData(fileList, call, event);
  });
};



export { dataSyncAction };
