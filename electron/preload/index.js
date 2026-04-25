const { contextBridge, ipcRenderer } = require('electron')
const crypto = require('crypto')

function formatTime(seconds) {
  const totalSeconds = Math.floor(seconds)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getMd5Value(name) {
  return crypto.createHash('md5').update(name).digest('hex')
}

function parseString(data) {
  return typeof data === 'string' ? data : JSON.stringify(data)
}

const replaceLive = (title) => {
  if (!title) return null
  return title.replace(/\（live\）/gi, '').replace(/\(live\)/gi, '')
}

const eventName = {
  LOCAL_CONF_INIT: { label: "本地设置页面初始化", value: "localConfInit" },
  OPEN_DIR: { label: "选择目录", value: "openDir" },
  DIR_DATA_CALLBACK: { label: "发送目录数据给页面", value: "dirDataCallback" },
  SYNC_DATA: { label: "同步数据", value: "syncData" },
  SYNC_DATA_CALLBACK: { label: "同步数据回调", value: "syncDataCallBack" },
  UPDATE_DIR: { label: "更新文件夹数据", value: "updateDir" },
  UPDATE_DIR_CALLBACK: { label: "更新文件夹数据回调", value: "updateDirCallBack" },
  INSTALL_LRC: { label: "下载歌词", value: "installLrc" },
  INSTALL_LRC_CALLBACK: { label: "下载歌词回调", value: "installLrcBack" },
  LOCAL: { label: "本地音乐", value: "local" },
  LOCAL_CALLBACK: { label: "本地音乐回调", value: "localCallback" },
  LRC: { label: "查询歌词", value: "lrc" },
  LRC_CALLBACK: { label: "查询歌词回调", value: "lrcCallback" },
  PRE: { label: "上一首", value: "pre" },
  NEXT: { label: "下一首", value: "next" },
  PLAY: { label: "播放/暂停", value: "play" },
}

contextBridge.exposeInMainWorld('electronAPI', {
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, callback) => ipcRenderer.on(channel, callback),
    removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  },
  utils: { formatTime, getMd5Value, parseString, replaceLive },
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
})

contextBridge.exposeInMainWorld('dataEvent', { eventName })
