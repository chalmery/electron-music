import path from "path";

const fs = require("fs")

//固定文件存储位置
function getPath(fileName) {
    let filePath = path.join(__dirname, '../' + fileName + '.json')
    console.log("path " + filePath)
    return filePath
}

//创建文件夹
function createDir(path) {
    fs.mkdir(path, (err) => {
        if (err) {
            console.log("createDir error " + err)
            return
        }
        console.log('createDir successfully')
    })
}

//文件操作封装
function save(fileName, data, callback) {
    console.log("data " + data)
    fs.writeFile(getPath(fileName), data, (err) => {
        if (err) {
            console.log("save error " + err)
            return
        }
        console.log('Data written successfully to disk')
        if (callback !== undefined) {
            callback()
        }
    })
}

function saveSync(fileName, data) {
    console.log("data " + data)
    fs.writeFileSync(getPath(fileName), data, (err) => {
        if (err) {
            console.log("save error " + err)
            return
        }
        console.log('Data written successfully to disk')
    })
}

function read(fileName, callback) {
    fs.readFile(getPath(fileName), 'utf-8', (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        console.log(JSON.parse(data))
        if (callback !== undefined) {
            callback(data)
        }
    })
}

function readSync(fileName) {
    let file = null
    try {
        file = fs.readFileSync(getPath(fileName), 'utf-8')
    } catch (err) {
    }
    return file;
}

export {
    save,
    saveSync,
    read,
    readSync,
    getPath,
    createDir
}