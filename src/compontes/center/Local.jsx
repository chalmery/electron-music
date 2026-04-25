import React, { useEffect, useRef, useState } from "react";
import { Layout, Dropdown, Table } from "antd";
const dataEvent = window.dataEvent;
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

  const items = [
    {
      label: "播放",
      key: "1",
    },
    {
      label: "添加到播放列表",
      key: "2",
    },
    {
      label: "打开文件所在目录",
      key: "3",
    },
    {
      label: "收藏到歌单",
      key: "4",
    },
  ];

  const [dirList, setDirList] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const dirListRef = useRef(dirList);
  const [thisMusic, setThisMusic] = useState(() => eventManager.lastPlayed);
  const [thisDir, setThisDir] = useState(() => eventManager.lastDir);

  useEffect(() => {
    window.electronAPI.ipcRenderer.send(dataEvent.eventName.LOCAL.value, dataEvent.eventName.LOCAL.value);

    window.electronAPI.ipcRenderer.on(dataEvent.eventName.LOCAL_CALLBACK.value, (event, data) => {
      setDirList(data);
      dirListRef.current = data;
      // 恢复上次选中的目录和歌曲列表
      const savedDir = eventManager.lastDir;
      if (savedDir) {
        const matched = data.find((item) => item.key === savedDir.key);
        if (matched) {
          setThisDir(matched);
          setDataSource(matched.value);
        }
      }
    });

    //下一首
    eventManager.subscribe(pageEvent.NEXT.value, handleNext);

    //上一首
    eventManager.subscribe(pageEvent.PRE.value, handlePre);

    // 取消订阅
    return () => {
      window.electronAPI.ipcRenderer.removeAllListeners(dataEvent.eventName.LOCAL_CALLBACK.value);
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
    window.electronAPI.ipcRenderer.send(dataEvent.eventName.LRC.value, data);
  };

  /**
   * 列表点击
   * @param record
   */
  function tableRowClick(record) {
    setThisMusic(record);
    eventManager.lastPlayed = record;
    eventManager.publish(pageEvent.CLICK_MUSIC.value, record);
    findLrc(record);
  }

  //文件夹列表点击
  const handleMenuClick = (record) => {
    setThisDir(record);
    eventManager.lastDir = record;
    const selectedItem = dirList.find((item) => item.key === record.key);
    if (selectedItem) {
      setDataSource(selectedItem.value);
    }
  };

  const rowClassName = (record) => {
    return thisMusic && record.hashCode === thisMusic.hashCode ? "color-row" : "";
  };

  const dirRowClassName = (record) => {
    return thisDir && record.key === thisDir.key ? "color-row" : "";
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
            <Dropdown
              menu={{
                items,
              }}
              trigger={["contextMenu"]}
            >
              <div>
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
              </div>
            </Dropdown>
            <div style={{ height: "55px" }}></div>
          </>
        )}
      </Content>
    </Layout>
  );
}
