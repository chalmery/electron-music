import React, {useEffect, useRef, useState} from "react";
import {Popover, Progress, Slider} from "antd";
import {
  AlignCenterOutlined,
  FontColorsOutlined,
  HeartOutlined,
  LeftCircleOutlined,
  LinkOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  RetweetOutlined,
  RightCircleOutlined,
  SoundOutlined
} from "@ant-design/icons";

import dog from "/dog.jpg";
import eventManager from "../../event/eventManager";
import formatTime from "@/util/utils";
import pageEvent from "@/event/pageEvent";

const fs = window.fs

function MyFooter() {
  const [title, setTitle] = useState("听你想听的歌");
  const [duration, setDuration] = useState("00:00");
  const [currentTime, setCurrentTime] = useState("00:00");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const [playState, setPlayState] = useState(false);
  const [volume, setVolume] = useState(100);

  useEffect(() => {
    const audioPlayer = audioRef.current;


    const handleEvent = (data) => {
      // 处理事件
      let {title, artist, album, type, path, duration} = data;
      setTitle(title);
      setDuration(formatTime(duration));
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

  return (
    <div style={{width: "100%", display: "inline-flex"}}>
      <span
        style={{
          float: "left",
          width: "200px",
          display: "inline-flex",
          padding: "0 10px 0 10px",
          justifyContent: "space-between",
          borderRight: "1px solid rgb(222, 222, 222)",
        }}
      >
        <LeftCircleOutlined/>
        {
          playState === true && (
            <PauseCircleOutlined onClick={() => {
              audioRef.current.pause()
              setPlayState(false)
            }}/>
          )
        }
        {
          playState === false && (
            <PlayCircleOutlined onClick={() => {
              audioRef.current.play()
              setPlayState(true)
            }}/>
          )
        }
        <RightCircleOutlined/>
          <Popover
            content={popoverContent}
            trigger="click"
          >
          <SoundOutlined/>
        </Popover>
        <RetweetOutlined/>
      </span>
      <span style={{flexGrow: 1, display: "inline-flex"}}>
        <div style={{position: "relative"}}>
          <img width={"50px"} src={dog}/>
        </div>
        <span style={{flexGrow: 1, padding: "0 5px 0 5px"}}>
          <span>{title}</span>
          <span style={{float: "right"}}>{currentTime}/{duration}</span>
          <Progress percent={progress} size={"small"} className={"widthMax"} showInfo={false}/>
        </span>
      </span>
      <span
        style={{
          padding: "0 5px 0 5px",
          float: "right",
          width: "192px",
          display: "inline-flex",
          //   padding: "0 5% 0 5%",
          justifyContent: "space-between",
          flexBasis: "100px",
          borderLeft: "1px solid rgb(222, 222, 222)",
        }}
      >
        <FontColorsOutlined/>
        <HeartOutlined/>
        <LinkOutlined/>
        <AlignCenterOutlined/>
      <audio ref={audioRef} id="audioPlayer"></audio>
      </span>
    </div>
  );
}

export default MyFooter;