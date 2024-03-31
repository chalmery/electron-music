import eventManager from "@/event/eventManager";
import pageEvent from "@/event/pageEvent";
import {listLoopRepository} from "@/strategy/repository/repository";
const dataEvent = window.dataEvent;

/**
 * 单曲循环
 * @param data 歌曲数据
 */
const singleLoop = (data) => {
  eventManager.publish(pageEvent.CLICK_MUSIC.value, data.metadata)
  electron.ipcRenderer.send(dataEvent.eventName.LRC.value, data.metadata)
}

function generateRandomNum(max, min) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机播放
 * @param data
 */
const random = (data) => {
  let {dirList, call} = data
  let randomNum = generateRandomNum(0, dirList.length - 1);
  let dir = dirList[randomNum]
  if (dir) {
    let randomNum = generateRandomNum(0, dir.value.length - 1);
    let metadata = dir.value[randomNum];
    if (metadata) {
      call(metadata)
      eventManager.publish(pageEvent.CLICK_MUSIC.value, metadata)
      electron.ipcRenderer.send(dataEvent.eventName.LRC.value, metadata)
    }
  }
}

/**
 * 列表循环
 * @param data
 */
const listLoop = (data) => {
  let fun = listLoopRepository.get(data.listType)
  fun(data)
}


export {singleLoop, random, listLoop}
