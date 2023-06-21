/**
 * 播放类型
 * @type {{SINGLE_LOOP: string, LIST_LOOP: string, RANDOM: string}}
 */
const playModeEnum = {
  SINGLE_LOOP: '单曲循环',
  LIST_LOOP: '列表循环',
  RANDOM: '随机播放',
};


/**
 * 列表循环类型
 * @type {{LocalListLoop: string, PlayListListLoop: string, LoveListLoop: string}}
 */
const listType = {
  LocalListLoop: '本地歌曲列表循环',
  LoveListLoop: '我喜欢的列表循环',
  PlayListListLoop: '播放列表的列表循环',
};

export {playModeEnum, listType}