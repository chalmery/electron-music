/**
 * 全部的事件
 * @type
*/
const eventName = {
  //本地设置页面相关事件
  LOCAL_CONF_INIT: { label: "本地设置页面初始化", value: "localConfInit" },
  OPEN_DIR: { label: "选择目录", value: "openDir" },
  DIR_DATA_CALLBACK: { label: "发送目录数据给页面", value: "dirDataCallback" },

  SYNC_DATA: { label: "同步数据", value: "syncData" },
  SYNC_DATA_CALLBACK: { label: "同步数据回调", value: "syncDataCallBack" },
  UPDATE_DIR: { label: "更新文件夹数据", value: "updateDir" },
  UPDATE_DIR_CALLBACK: { label: "更新文件夹数据回调", value: "updateDirCallBack" },

  INSTALL_LRC: { label: "下载歌词", value: "installLrc" },
  INSTALL_LRC_CALLBACK: { label: "下载歌词回调", value: "installLrcBack" },

  //本地音乐
  LOCAL: { label: "本地音乐", value: "local" },
  LOCAL_CALLBACK: { label: "本地音乐回调", value: "localCallback" },

  //查询歌词
  LRC: { label: "查询歌词", value: "lrc" },
  LRC_CALLBACK: { label: "查询歌词回调", value: "lrcCallback" },

  //切歌
  PRE: {label: "上一首",value: "pre"},
  NEXT: {label: "下一首",value: "next"},
  PLAY:{label: "播放/暂停",value: "play"},
  
};

export  {eventName};
