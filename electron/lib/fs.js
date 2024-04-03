import {CharConstants} from "../constants/constant";
import fs from 'fs';
import {getPath} from "./metadata/metadata";


/**
 * 创建文件夹
 * @param path
 */
function createDir(path) {
  fs.mkdir(path, (err) => {
    if (err) {
      console.log("createDir error " + err);
      return;
    }
    console.log("createDir successfully");
  });
}

/**
 * 存储文件
 * @param fileName
 * @param data
 * @param callback
 */
function save(fileName, data, callback) {
  fs.writeFile(getPath(fileName), data, (err) => {
    if (err) {
      console.log("save error " + err);
      return;
    }
    console.log("Data written successfully to disk");
    if (callback !== undefined) {
      callback();
    }
  });
}


/**
 * 同步存储文件
 * @param fileName
 * @param data
 */
function saveSync(fileName, data) {
  fs.writeFileSync(getPath(fileName), data, (err) => {
    if (err) {
      console.log("save error " + err);
      return;
    }
    console.log("Data written successfully to disk");
  });
}

/**
 * 读文件 根据名称
 * @param fileName
 * @param callback
 */
function read(fileName, callback) {
  fs.readFile(getPath(fileName), CharConstants.UTF_8, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (callback !== undefined) {
      callback(data);
    }
  });
}

/**
 * 读文件 根据路径
 * @param path 路径
 * @param callback 回调
 */
function readByPath(path, callback) {
  fs.readFile(path, CharConstants.UTF_8, (err, data) => {
    if (err) {
      console.log(err);
    }
    if (callback !== undefined) {
      callback(data);
    }
  });
}


/**
 * 同步读文件
 * @param fileName 路径
 * @returns {null} 文件对象
 */
function readSync(fileName) {
  let file = null;
  try {
    file = fs.readFileSync(getPath(fileName), CharConstants.UTF_8);
  } catch (err) {}
  return file;
}

/**
 * 同步读目录
 * @param path 路径
 * @returns {null} 文件对象
 */
function readdirSync(path) {
  let file = null;
  try {
    file = fs.readdirSync(path, CharConstants.UTF_8);
  } catch (err) {}
  return file;
}

/**
 * 判断对象是否是文件
 * @param fileName 文件名称
 * @param callback 回调
 */
function access(fileName,callback){
  fs.access(fileName,callback)
}

/**
 * 获取文件状态
 * * 比如用于判断对象是否是文件
 * @param fileName 文件名称
 * @returns {Stats} 返回状态
 */
function statSync(fileName){
  return fs.statSync(fileName)
}


export { save, saveSync, read, readSync,access,statSync,readByPath,readdirSync};
