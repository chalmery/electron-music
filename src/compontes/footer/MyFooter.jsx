import React, {useEffect, useRef, useState} from "react";
import {Popover, Progress, Slider, Tooltip} from "antd";
import icon from '/icons/music256x256.png';
import eventManager from "../../event/eventManager";
import formatTime from "@/util/utils";
import pageEvent from "@/event/pageEvent";
import {listType, playModeEnum} from "@/enums/enums";
import {
  Favorite,
  FavoriteBorder,
  Pause,
  PlayArrow,
  Repeat,
  RepeatOne,
  Shuffle,
  SkipNext,
  SkipPrevious,
  VolumeOff,
  VolumeUp
} from '@mui/icons-material';

const fs = window.fs

//播放模式枚举
const IconMap = {
  '单曲循环': <RepeatOne/>,
  '列表循环': <Repeat/>,
  '随机播放': <Shuffle/>,
};


function MyFooter() {
  //当前歌曲元数据
  let metadata = useRef(null);
  //标题
  const [title, setTitle] = useState("听你想听的歌");
  //当前时间
  const [duration, setDuration] = useState("00:00");
  //总时间
  const [currentTime, setCurrentTime] = useState("00:00");
  // 进度条
  const [progress, setProgress] = useState(0);
  // audio对象
  const audioRef = useRef(null);
  //播放状态
  const [playState, setPlayState] = useState(false);
  //音量
  const [volume, setVolume] = useState(100);
  //专辑图像
  const [picture, setPicture] = useState(icon);
  //是否喜欢
  const [favorite, setFavorite] = useState(false);
  //播放模式
  const [playMode, setPlayMode] = useState(playModeEnum.LIST_LOOP);
  const playModeRef = useRef(playModeEnum.LIST_LOOP);

  //进度条长度
  const progressRef = useRef(null);


  useEffect(() => {
    const audioPlayer = audioRef.current;


    // 订阅事件
    eventManager.subscribe(pageEvent.CLICK_MUSIC.value, handleEvent);


    const updateProgress = () => {
      const currentTime = audioPlayer.currentTime;
      const duration = audioPlayer.duration;
      const progressPercent = (currentTime / duration) * 100;
      setCurrentTime(formatTime(currentTime))
      setProgress(progressPercent);
      //播放完毕，根据播放类型决定如何继续
      if (currentTime === duration) {
        if (metadata.current) eventManager.publish(pageEvent.NEXT.value, {
          playMode: playModeRef.current,
          listType: listType.LocalListLoop,
          metadata: metadata.current
        })
      }
    };

    audioPlayer.addEventListener(pageEvent.TIME_UPDATE.value, updateProgress);

    // 取消订阅
    return () => {
      eventManager.unsubscribe(pageEvent.CLICK_MUSIC.value, handleEvent);
      audioPlayer.removeEventListener(pageEvent.TIME_UPDATE.value, updateProgress);
    };

  }, [audioRef.current]);


  const handleEvent = (data) => {
    metadata.current = data
    // 处理事件
    let {title, picture, path, duration} = data
    //设置属性
    setTitle(title);
    setDuration(formatTime(duration))
    if (picture) {
      const fileUrl = `file://${picture}`
      setPicture(fileUrl)
    }
    //播放音乐
    play(path)
    setPlayState(true)
  };


  function play(path) {
    fs.readFile(path, (error, data) => {
      if (error) {
        console.error('Error reading file:', error);
        return;
      }
      const audioBlob = new Blob([data], {type: 'audio/mp3'});
      audioRef.current.src = URL.createObjectURL(audioBlob);
      audioRef.current.play();
    });
  }

  const handleVolumeChange = (value) => {
    setVolume(value)
    audioRef.current.volume = value / 100
  };

  const popoverContent = (
    <Slider vertical style={{height: '80px'}} value={volume} onChange={handleVolumeChange}/>
  );

  //播放，暂停
  const handlePlayPauseClick = () => {
    if (metadata.current) {
      if (playState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setPlayState(!playState);
    }
  };


  const handleFavorite = () => {

  };

  const handlePlayMode = () => {
    if (playMode === playModeEnum.LIST_LOOP) {
      setPlayMode(playModeEnum.SINGLE_LOOP)
      playModeRef.current = playModeEnum.SINGLE_LOOP
    }
    if (playMode === playModeEnum.SINGLE_LOOP) {
      setPlayMode(playModeEnum.RANDOM)
      playModeRef.current = playModeEnum.RANDOM
    }
    if (playMode === playModeEnum.RANDOM) {
      setPlayMode(playModeEnum.LIST_LOOP)
      playModeRef.current = playModeEnum.LIST_LOOP
    }
  }


  /**
   * 进度条点击
   * 进度条长度来确定音乐进度
   */
  const handleClick = (e) => {
    if (audioRef) {
      const progressBar = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - progressBar.left
      const progressBarWidth = progressBar.width
      const clickPercentage = clickX / progressBarWidth
      const audioPlayer = audioRef.current
      audioRef.current.currentTime = audioPlayer.duration * clickPercentage;
    }
  };

  return (
    <div style={{height: '55px', width: "100%", display: "inline-flex"}}>
      {/*左侧播放按钮栏*/}
      <span
        style={{
          float: "left",
          width: "200px",
          display: "inline-flex",
          padding: "0 10px 0 10px",
          alignItems: 'center',
          justifyContent: "space-between",
          borderRight: "1px solid rgb(222, 222, 222)",
        }}
      >
       <SkipPrevious onClick={() => {
         if (metadata.current) eventManager.publish(pageEvent.PRE.value, {
           playMode: playModeRef.current,
           listType: listType.LocalListLoop,
           metadata: metadata.current
         })
       }}/>
        {playState ? (
          <Pause onClick={handlePlayPauseClick}/>
        ) : (
          <PlayArrow onClick={handlePlayPauseClick}/>
        )}
        <SkipNext onClick={() => {
          if (metadata.current) eventManager.publish(pageEvent.NEXT.value, {
            playMode: playModeRef.current,
            listType: listType.LocalListLoop,
            metadata: metadata.current
          })
        }}/>
          <Popover
            content={popoverContent}
            trigger="click"
          >
          {volume === 0 ? (
            <VolumeOff/>
          ) : (
            <VolumeUp/>
          )}
        </Popover>
        {/* 播放模式图标 */}
        <span style={{display: "inline-flex", alignItems: 'center',}} onClick={handlePlayMode}>
           <Tooltip color={"white"} title={<span style={{color: 'black'}}>{playMode}</span>}>
              {IconMap[playMode]}
           </Tooltip>
        </span>
        {/*我喜欢的图标*/}
        {favorite ? (
          <Favorite sx={{color: '#FF9B9B'}} onClick={handleFavorite}/>
        ) : (
          <FavoriteBorder onClick={handleFavorite}/>
        )}
      </span>

      <span style={{flexGrow: 1, display: "inline-flex", padding: '5px'}}>
        <div className='imgCenter' style={{width: "45px", textAlign: "center"}}>
          <img width={"100%"} src={picture} alt={icon} style={{borderRadius: "2px"}}/>
        </div>
        <span style={{flexGrow: 1, padding: "0 5px 0 5px"}}>
          <span>{title}</span>
          <span style={{float: "right"}}>{currentTime}/{duration}</span>
          <Progress percent={progress} onClick={handleClick} size={"small"} ref={progressRef} className={"widthMax"}
                    showInfo={false}/>
        </span>

      <audio ref={audioRef} id="audioPlayer"></audio>
      </span>
    </div>
  );
}

export default MyFooter;
