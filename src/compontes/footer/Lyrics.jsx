import React, {useEffect, useState} from 'react'

import icon from '/icons/music256x256.png';
import pageEvent from "@/event/pageEvent";
import eventManager from "@/event/eventManager";
import dataEvent from "../../../electron/lib/event";
import localSetting from "../../../electron/lib/event";

export default function Lyrics(props) {

  /**
   * 正在播放的歌曲
   */
  const [metadata, setMetadata] = useState(null);
  /**
   * 歌词
   */
  const [lrc, setLrc] = useState(null);

  const {show} = props;

  useEffect(() => {
    // 订阅事件
    eventManager.subscribe(pageEvent.CLICK_MUSIC.value, handleEvent)


    //查询歌词
    electron.ipcRenderer.on(dataEvent.LRC_CALLBACK.value, (event, data) => {
      setLrc(data)
    });


    return () => {
      eventManager.unsubscribe(pageEvent.CLICK_MUSIC.value, handleEvent);
      electron.ipcRenderer.removeAllListeners(localSetting.LRC_CALLBACK.value);
    }
  }, [])

  const handleEvent = (data) => {
    setMetadata(data)
  };


  const containerStyle = {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100%',
    width: '100%',
    backdropFilter: 'blur(8px)',
  }
  if (metadata) {
    containerStyle.backgroundImage = `url(${'file://' + metadata.picture})`;
  } else {
    containerStyle.backgroundImage = null;
  }
  const lyricsClass = show ? 'lyrics-container show' : 'lyrics-container hide';

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(71,71,71,0.8)', // 设置毛玻璃效果的颜色和透明度
    padding: '5% 5% 10% 5%'
  };

  return (
    <div className={lyricsClass} style={containerStyle}>
      <div style={overlayStyle}>
        <div style={{display: "fixed", height: "100%"}}>
          <div style={{
            float: "left", height: "100%", width: "50%", display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <img className='img' width={"250px"} src={metadata === null ? icon : `file://${metadata.picture}`}
                 alt={icon}/>
          </div>
          <div style={{float: "right", height: "100%", width: "50%"}}>

            <div style={{whiteSpace: 'pre-line'}}>
              {lrc}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}