//json,字符串转换
function parseString(data) {
    return data instanceof String ? data : JSON.stringify(data);
}

export {
    parseString,
}