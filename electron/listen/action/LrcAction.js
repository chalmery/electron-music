import {ipcMain} from "electron";
import {eventName} from "../../lib/metadata/event";
import {read} from "../../lib/fs";


const LrcAction = () => {
  ipcMain.on(eventName.LRC.value, (event, data) => {
    let fileName = data.hashCode + '.lrc';
    read(fileName, (data) => {
      event.reply(eventName.LRC_CALLBACK.value, parseLrc(data))
    })
  })
}


/**
 * 解析歌词
 * @param lrc
 * @returns {*[]}
 */
function parseLrc(lrc) {
  if (!lrc) {
    return null
  }
  const lines = lrc.split('\n');
  const lrcArray = [];

  const timeRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?]/;
  for (let line of lines) {
    const match = line.match(timeRegex);
    if (match) {
      const minutes = parseInt(match[1]);
      const seconds = parseInt(match[2]);
      const milliseconds = parseInt(match[3]) || 0;
      const time = minutes * 60 + seconds + milliseconds / 1000;
      const text = line.replace(timeRegex, '').trim();
      lrcArray.push({time, text});
    }
  }
  return lrcArray
}


export {
  LrcAction
}