import React from "react";
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

function MyFooter() {
    return (
        <div style={{width: "100%", display: "inline-flex"}}>
      <span
          style={{
              float: "left",
              width: "200px",
              display: "inline-flex",
              padding: "0 10px 0 10px",
              justifyContent: "space-between",
              borderRight: '1px solid rgb(222, 222, 222)'
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
          <span>歌曲名称</span>
          <span style={{float: "right"}}>00:00/00:00</span>
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
                    borderLeft: '1px solid rgb(222, 222, 222)'
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
