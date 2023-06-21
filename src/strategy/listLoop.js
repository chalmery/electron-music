import eventManager from "@/event/eventManager";
import pageEvent from "@/event/pageEvent";

/**
 * 本地播放列表循环
 * @param data
 */
const localListLoop = (data) => {
  let {metadata, dirList} = data
  if (metadata) {
    const dirInfo = dirList.find(item => item.key === metadata.parentPath)
    const values = dirInfo.value;
    //找到指定key的元素的索引。
    const currentIndex = values.findIndex(item => item.key === metadata.key);
    const nextIndex = (currentIndex + 1) % values.length;
    const nextMetaData = values[nextIndex];
    eventManager.publish(pageEvent.CLICK_MUSIC.value, nextMetaData);
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