import eventManager from "@/event/eventManager";
import pageEvent from "@/event/pageEvent";
import {listLoopRepository} from "@/strategy/repository/repository";

/**
 * 单曲循环
 * @param data 歌曲数据
 */
const singleLoop = (data) => {
  eventManager.publish(pageEvent.CLICK_MUSIC.value, data.metadata);
}

/**
 * 随机播放
 * @param data
 */
const random = (data) => {
  console.log("随机播放")
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
