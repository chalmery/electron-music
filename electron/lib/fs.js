import { log } from "console";
import {CharConstants} from "../constants/constant";

const path = require("path");
const fs = require("fs");
const { app } = require("electron");

//固定文件存储位置
function getPath(fileName) {
  return app.getPath("userData") + CharConstants.SLASH + fileName;
}

//创建文件夹
function createDir(path) {
  fs.mkdir(path, (err) => {
    if (err) {
      console.log("createDir error " + err);
      return;
    }
    console.log("createDir successfully");
  });
}

//存储文件
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


//同步存储文件
function saveSync(fileName, data) {
  fs.writeFileSync(getPath(fileName), data, (err) => {
    if (err) {
      console.log("save error " + err);
      return;
    }
    console.log("Data written successfully to disk");
  });
}

//读文件
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

//读文件
function readByPath(path, callback) {
  fs.readFile(path, CharConstants.UTF_8, (err, data) => {
    if (err) {
      console.log(err);
    }
    log(data)
    if (callback !== undefined) {
      callback(data);
    }
  });
}


//同步读文件
function readSync(fileName) {
  let file = null;
  try {
    file = fs.readFileSync(getPath(fileName), CharConstants.UTF_8);
  } catch (err) {}
  return file;
}

//同步读目录
function readdirSync(path) {
  let file = null;
  try {
    file = fs.readdirSync(path, CharConstants.UTF_8);
  } catch (err) {}
  return file;
}

function access(fileName,callback){
  fs.access(fileName,callback)
}

function statSync(fileName){
  return fs.statSync(fileName)
}


export { save, saveSync, read, readSync, getPath,access,statSync,readByPath,readdirSync};
