//格式处理
function parseString(data) {
    return data instanceof String ? data : JSON.stringify(data);
}

export {
    parseString,
}