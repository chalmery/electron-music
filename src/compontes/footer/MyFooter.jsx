import React, {useEffect, useState} from "react";
import {Progress} from "antd";
import {
    AlignCenterOutlined,
    FontColorsOutlined,
    HeartOutlined,
    LeftCircleOutlined,
    LinkOutlined,
    PlayCircleOutlined,
    RetweetOutlined,
    RightCircleOutlined,
    SoundOutlined,
} from "@ant-design/icons";

import dog from "/dog.jpg";

import eventManager from "../../event/eventManager";

function MyFooter() {
    const [title, setTitle] = useState("听你想听的歌");
    const [duration, setDuration] = useState('00:00');

    useEffect(() => {
        const handleEvent = (data) => {
            // 处理事件
            let {title, artist, album, type, path, duration} = data
            setTitle(title)
            setDuration(formatTime(duration))
        };

        // 订阅事件
        eventManager.subscribe("myEvent", handleEvent);

        // 取消订阅
        return () => {
            eventManager.unsubscribe("myEvent", handleEvent);
        };
    }, []);

    function formatTime(seconds) {
        const totalSeconds = Math.floor(seconds); // 取整数部分
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        const formattedMins = mins.toString().padStart(2, '0');
        const formattedSecs = secs.toString().padStart(2, '0');
        return `${formattedMins}:${formattedSecs}`;
    }

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
        <PlayCircleOutlined/>
        <RightCircleOutlined/>
        <SoundOutlined/>
        <RetweetOutlined/>
      </span>

            <span style={{flexGrow: 1, display: "inline-flex"}}>
        <div style={{position: "relative"}}>
          <img width={"50px"} src={dog}/>
        </div>
        <span style={{flexGrow: 1, padding: "0 5px 0 5px"}}>
          <span>{title}</span>
          <span style={{float: "right"}}>00:00/{duration}</span>
          <Progress size={"small"} className={"widthMax"} showInfo={false}/>
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
      </span>
        </div>
    );
}

export default MyFooter;
