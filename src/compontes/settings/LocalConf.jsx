import React, { useEffect, useState } from "react";
import { Button, List, message, Space } from "antd";
import localSetting from "../../../electron/lib/event.js";
import dataEvent from "../../../electron/lib/event";

const electron = window.electron;

export default function LocalConf() {
  const [localDir, setLocalDir] = useState();

  //按钮loading
  const [loading, setLoading] = useState(false);

  //下载歌词按钮loading
  const [lrcLoading, setLrcLoading] = useState(false);

  useEffect(() => {
    //查数据
    electron.ipcRenderer.send(localSetting.LOCAL_CONF_INIT.value, localSetting.LOCAL_CONF_INIT.value);

    //回调
    electron.ipcRenderer.on(localSetting.DIR_DATA_CALLBACK.value, (event, files) => {
      setLocalDir(files);
    });

    //回调
    electron.ipcRenderer.on(localSetting.SYNC_DATA_CALLBACK.value, (event, data) => {
      setLoading(false);
      message.success("同步成功", 2);
      if (data !== null) {
        electron.ipcRenderer.send(dataEvent.LOCAL.value, dataEvent.LOCAL.value);
      }
    });

    //回调
    electron.ipcRenderer.on(localSetting.INSTALL_LRC_CALLBACK.value, (event) => {
      setLrcLoading(false);
      message.success("下载完成", 2);
    });

    return () => {
      electron.ipcRenderer.removeAllListeners(localSetting.DIR_DATA_CALLBACK.value);
      electron.ipcRenderer.removeAllListeners(localSetting.SYNC_DATA_CALLBACK.value);
      electron.ipcRenderer.removeAllListeners(localSetting.INSTALL_LRC_CALLBACK.value);
    };
  }, []);

  //同步数据
  const enterLoading = () => {
    setLoading(true);
    electron.ipcRenderer.send(localSetting.SYNC_DATA.value, localSetting.SYNC_DATA.value);
  };

  //传递打开本地文件选择器选项
  const openDirSelect = () => {
    console.log("start");
    electron.ipcRenderer.send(localSetting.OPEN_DIR.value, localSetting.OPEN_DIR.value);
  };

  //下载歌词
  const installLrc = () => {
    setLrcLoading(true);
    electron.ipcRenderer.send(localSetting.INSTALL_LRC.value, localDir);
  };

  return (
    <Space direction="vertical" className="widthMax">
      <Space direction="horizontal">
        <Button type="primary" onClick={openDirSelect}>
          选择目录
        </Button>
        <Button loading={loading} onClick={enterLoading}>
          同步数据
        </Button>
        <Button loading={lrcLoading} onClick={installLrc}>
          下载歌词
        </Button>
      </Space>
      <List
        size="small"
        header={<div>本地音乐文件目录</div>}
        bordered
        dataSource={localDir}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Space>
  );
}
