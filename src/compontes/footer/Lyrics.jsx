import React, { useEffect, useRef, useState } from "react";

import icon from "/icons/music@6x.png";
import pageEvent from "@/event/pageEvent";
import eventManager from "@/event/eventManager";
const dataEvent = window.dataEvent;
import {resolvePictureToBase64} from "@/util/filtUtils";

export default function Lyrics(props) {
  /**
   * 正在播放的歌曲
   */
  const [metadata, setMetadata] = useState(null);
  /**
   * 歌词
   */
  const [lrc, setLrc] = useState([]);
  const lrcRef = useRef(null);
  const lyricsContainerRef = useRef(null);

  /**
   * 展示状态
   */
  const { show } = props;

  /**
   * 专辑图片的base64对象
   */
  const [picture, setPicture] = useState(null);


  useEffect(() => {
    // 订阅事件
    eventManager.subscribe(pageEvent.CLICK_MUSIC.value, handleEvent);

    //当前歌曲时间
    eventManager.subscribe(pageEvent.CURRENT_TIME.value, handleCurrentTime);

    //查询歌词
    electron.ipcRenderer.on(dataEvent.eventName.LRC_CALLBACK.value, (event, data) => {
      setLrc(data);
      lrcRef.current = data;
    });

    return () => {
      eventManager.unsubscribe(pageEvent.CLICK_MUSIC.value, handleEvent);
      eventManager.unsubscribe(pageEvent.CURRENT_TIME.value, handleCurrentTime);
      electron.ipcRenderer.removeAllListeners(dataEvent.eventName.LRC_CALLBACK.value);
    };
  }, []);

  const handleEvent = (data) => {
    //放置当前播放歌曲元数据
    setMetadata(data);
    //解析专辑为base64
    resolvePictureToBase64(data.picture,(base64)=>{
      setPicture(base64)
    });
  };

  /**
   * 改变歌词位置
   * @param data
   */
  const handleCurrentTime = (data) => {
    if (!lrcRef.current) {
      return;
    }
    // 寻找当前播放时间对应的歌词索引
    let currentLyricIndex = 0;
    for (let i = 0; i < lrcRef.current.length; i++) {
      if (data >= lrcRef.current[i].time) {
        currentLyricIndex = i;
      } else {
        break;
      }
    }

    // 滚动到当前歌词
    const lyricsContainer = lyricsContainerRef.current;
    if (lyricsContainer) {
      const lyricElements = lyricsContainer.getElementsByTagName("p");
      for (let i = 0; i < lyricElements.length; i++) {
        if (i === currentLyricIndex) {
          lyricElements[i].classList.add("highlight");
        } else {
          lyricElements[i].classList.remove("highlight");
        }
      }

      const lyricElement = lyricElements[currentLyricIndex];
      if (lyricElement) {
        lyricElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const containerStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100%",
    width: "100%",
    backdropFilter: "blur(8px)",
  };
  if (metadata) {
    containerStyle.backgroundImage = `url(${picture})`;
  }
  const lyricsClass = show ? "lyrics-container show" : "lyrics-container hide";

  return (
    <div className={lyricsClass} style={containerStyle}>
      <div className="lrc-overlay">
        <div className="lrc-overlay-content">
          <div className="lrc-left">
            <div>
              <img
                className="lrc-left-picture"
                src={(metadata === null)||(metadata.picture === null) ? icon : `${picture}`}
                alt={icon}
              />
              <div className="lrc-left-info">
                <h3>{metadata?.album}</h3>
                <span>{metadata?.artist}</span>
              </div>
            </div>
          </div>

          <div className="lrc-right">
            <div className="lrc-right-lrc">
              <div ref={lyricsContainerRef}>
                {lrc && lrc.length > 0 ? lrc.map((lyric, index) => <p key={index}>{lyric.text}</p>) : <p>暂无歌词</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
