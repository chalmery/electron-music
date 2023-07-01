import React, { useEffect, useRef, useState } from "react";
import { Layout, Menu, Table } from "antd";
import dataEvent from "../../../electron/lib/event";
import localSetting from "../../../electron/lib/event";
import eventManager from "../../event/eventManager";
import pageEvent from "@/event/pageEvent";
import { playModeRepository } from "@/strategy/repository/repository";

const { Content, Sider } = Layout;

export default function Local() {
  const columns = [
    { title: "歌曲", dataIndex: "title", key: "title" },
    { title: "歌手", dataIndex: "artist", key: "artist" },
    { title: "专辑", dataIndex: "album", key: "album" },
    { title: "时长", dataIndex: "duration", key: "duration" },
    { title: "类型", dataIndex: "type", key: "type" },
  ];

  const dirColumns = [
    {
      title: "文件夹",
      dataIndex: "label",
      key: "label",
    },
  ];

  const [dirList, setDirList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const dirListRef = useRef(dirList);
  const [thisMusic, setThisMusic] = useState(null);
  const [thisDir, setThisDir] = useState(null);

  useEffect(() => {
    //查数据
    electron.ipcRenderer.send(dataEvent.LOCAL.value, dataEvent.LOCAL.value);

    //回调
    electron.ipcRenderer.on(dataEvent.LOCAL_CALLBACK.value, (event, data) => {
      setDirList(data);
      dirListRef.current = data;
    });

    //下一首
    eventManager.subscribe(pageEvent.NEXT.value, handleNext);

    //上一首
    eventManager.subscribe(pageEvent.PRE.value, handlePre);

    // 取消订阅
    return () => {
      electron.ipcRenderer.removeAllListeners(localSetting.LOCAL_CALLBACK.value);
      eventManager.unsubscribe(pageEvent.NEXT.value, handleNext);
      eventManager.unsubscribe(pageEvent.PRE.value, handlePre);
    };
  }, []);

  /**
   * 上一首事件处理
   * @param data 当前音乐元数据
   */
  const handlePre = (data) => {
    //策略
    let { playMode } = data;
    let fun = playModeRepository.get(playMode);
    const newData = {
      ...data,
      dirList: dirListRef.current,
      type: pageEvent.PRE,
      call: setThisMusic,
    };
    fun(newData);
  };

  /**
   * 下一首事件处理
   * @param data 当前音乐元数据
   */
  const handleNext = (data) => {
    //策略
    let { playMode } = data;
    let fun = playModeRepository.get(playMode);
    const newData = {
      ...data,
      dirList: dirListRef.current,
      type: pageEvent.NEXT,
      call: setThisMusic,
    };
    fun(newData);
  };

  /**
   * 查询歌词
   * @param data
   */
  const findLrc = (data) => {
    electron.ipcRenderer.send(dataEvent.LRC.value, data);
  };

  /**
   * 列表点击
   * @param record
   */
  function tableRowClick(record) {
    setThisMusic(record);
    eventManager.publish(pageEvent.CLICK_MUSIC.value, record);
    findLrc(record);
  }

  //文件夹列表点击
  const handleMenuClick = (record) => {
    setThisDir(record);
    const selectedItem = dirList.find((item) => item.key === record.key);
    if (selectedItem) {
      const { value } = selectedItem;
      setDataSource(value);
    }
  };

  const rowClassName = (record, index) => {
    if (thisMusic) {
      return thisMusic === record ? "color-row" : "";
    }
    return "";
  };

  const dirRowClassName = (record, index) => {
    if (thisDir) {
      return thisDir === record ? "color-row" : "";
    }
    return "";
  };

  return (
    <Layout className="layout">
      <Sider className="scrollable-container auto">
        {dirList.length > 0 && (
          <>
            <Table
              onRow={(record) => {
                return {
                  onClick: () => {
                    handleMenuClick(record);
                  },
                };
              }}
              size={"small"}
              rowClassName={dirRowClassName}
              showHeader={false}
              dataSource={dirList}
              columns={dirColumns}
              pagination={false}
            />
            <div style={{ height: "55px" }}></div>
          </>
        )}
      </Sider>

      <Content className="scrollable-container auto heightMax">
        {dataSource.length > 0 && (
          <>
            <Table
              onRow={(record) => {
                return {
                  onClick: () => {
                    tableRowClick(record);
                  },
                };
              }}
              rowClassName={rowClassName}
              size={"small"}
              columns={columns}
              pagination={false}
              dataSource={dataSource}
            />
            <div style={{ height: "55px" }}></div>
          </>
        )}
      </Content>
    </Layout>
  );
}
