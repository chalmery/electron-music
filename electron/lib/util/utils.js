import crypto from "crypto";

/**
 * json,字符串转换，如果是字符串直接返回
 * @param data 字符串 or 对象
 * @returns {String|string}
 */
function parseString(data) {
    return data instanceof String ? data : JSON.stringify(data);
}


/**
 * 转换时间戳为 分钟:秒 格式 的字符串
 * @param seconds
 * @returns {string}
 */
function formatTime(seconds) {
    const totalSeconds = Math.floor(seconds); // 取整数部分
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedMins = mins.toString().padStart(2, "0");
    const formattedSecs = secs.toString().padStart(2, "0");
    return `${formattedMins}:${formattedSecs}`;
}

/**
 * 根据字符串获取md5值
 * @param name
 * @returns {string}
 */
function getMd5Value(name) {
    return crypto.createHash("md5").update(name).digest("hex")
}


/**
 * 如果歌曲有live 去掉live
 * @param {*} title
 * @returns
 */
const replaceLive = (title) => {
    if (!title) {
        return null;
    }
    let data = title.replace(/\（live\）/g, "");
    return data.replace(/\(live\)/g, "");
};


export {
    parseString,formatTime,getMd5Value,replaceLive
}