import eventManager from "@/event/eventManager";
import pageEvent from "@/event/pageEvent";
const dataEvent = window.dataEvent;

/**
 * 本地播放列表循环
 * @param data
 */
const localListLoop = (data) => {
  let {metadata, dirList, type, call} = data
  if (metadata) {
    const dirInfo = dirList.find(item => item.key === metadata.parentPath)
    const values = dirInfo.value;
    //找到指定key的元素的索引。
    const currentIndex = values.findIndex(item => item.key === metadata.key);
    let nextIndex;
    if (type === pageEvent.NEXT) {
      nextIndex = (currentIndex + 1) % values.length;
    } else {
      nextIndex = (currentIndex - 1 + values.length) % values.length;
    }
    const nextMetaData = values[nextIndex];
    call(nextMetaData)
    eventManager.publish(pageEvent.CLICK_MUSIC.value, nextMetaData)
    electron.ipcRenderer.send(dataEvent.eventName.LRC.value, nextMetaData)
  }
}

/**
 * 我喜欢的列表循环
 * @param metadata
 */
const loveListLoop = (metadata) => {
  console.log("我喜欢的列表循环")
}

/**
 * 播放列表的列表循环
 * @param metadata
 */
const playListListLoop = (metadata) => {
  console.log("播放列表的列表循环")
}


export {localListLoop, loveListLoop, playListListLoop}
