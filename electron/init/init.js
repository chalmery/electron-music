import {createDir} from "../lib/fs";
import path from "path";

function init() {
    // 创建data文件夹，为后续数据存储准备
    createDir(path.join(__dirname, '../data'))
}

export {
    init,
}