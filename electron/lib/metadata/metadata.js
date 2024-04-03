import {CharConstants} from "../../constants/constant";

import {app} from 'electron';

/**
 * 音乐文件类型
 */
const fileTypeList = ["FLAC", "flac", "MP3", "mp3", "ape", "APE", "MPEG", "Ogg"];


/**
 * 文件名称
 * @type {{META_DATA: {label: string, value: string}, DIRS: {label: string, value: string}}}
 */
const fileName = {
  DIRS: {label: "保存的目录", value: "dirs.json"},
  META_DATA: {label: "保存的音乐信息", value: "metadata.json"},
}


/**
 * 文件存储位置
 * @param fileName
 * @returns {string}
 */
function getPath(fileName) {
  return app.getPath("userData") + CharConstants.SLASH + fileName;
}

export {fileName,fileTypeList, getPath};