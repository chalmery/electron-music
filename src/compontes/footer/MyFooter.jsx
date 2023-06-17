import React, {useEffect, useRef, useState} from "react";
import {Popover, Progress, Slider, Tooltip} from "antd";
import icon from '/icons/music256x256.png';
import eventManager from "../../event/eventManager";
import formatTime from "@/util/utils";
import pageEvent from "@/event/pageEvent";
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
const PlayMode = {
  SINGLE_LOOP: '单曲循环',
  LIST_LOOP: '列表循环',
  RANDOM: '随机播放',
};
const IconMap = {
  '单曲循环': <RepeatOne/>,
  '列表循环': <Repeat/>,
  '随机播放': <Shuffle/>,
};


function MyFooter() {
  //当前歌曲元数据
  const [metadata, setMetadata] = useState(null);
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
  const [playMode, setPlayMode] = useState(PlayMode.LIST_LOOP);


  useEffect(() => {
    const audioPlayer = audioRef.current;
    const handleEvent = (data) => {
      setMetadata(data)
      // 处理事件
      let {title, picture, path, duration} = data
      //设置属性
      setTitle(title);
      setDuration(formatTime(duration))
      if (picture) {
        console.log(picture)
        const fileUrl = `file://${picture}`
        setPicture(fileUrl)
      }
      //播放音乐
      play(path)
      setPlayState(true)
    };


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
        eventManager.publish(pageEvent.NEXT.value, metadata);
      }
    };

    audioPlayer.addEventListener(pageEvent.TIME_UPDATE.value, updateProgress);

    // 取消订阅
    return () => {
      eventManager.unsubscribe(pageEvent.CLICK_MUSIC.value, handleEvent);
      audioPlayer.removeEventListener(pageEvent.TIME_UPDATE.value, updateProgress);
    };

  }, [audioRef.current]);


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
    if (playState) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlayState(!playState);
  };


  const handleFavorite = () => {

  };

  const handlePlayMode = () => {
    console.log(playMode)
    if (playMode === PlayMode.LIST_LOOP) {
      setPlayMode(PlayMode.SINGLE_LOOP)
    }
    if (playMode === PlayMode.SINGLE_LOOP) {
      setPlayMode(PlayMode.RANDOM)
    }
    if (playMode === PlayMode.RANDOM) {
      setPlayMode(PlayMode.LIST_LOOP)
    }
  }


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
       <SkipPrevious/>
        {playState ? (
          <Pause onClick={handlePlayPauseClick}/>
        ) : (
          <PlayArrow onClick={handlePlayPauseClick}/>
        )}
        <SkipNext/>
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
          <Progress percent={progress} size={"small"} className={"widthMax"} showInfo={false}/>
        </span>

      <audio ref={audioRef} id="audioPlayer"></audio>
      </span>
    </div>
  );
}

export default MyFooter;
