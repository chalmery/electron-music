import React, { useEffect, useState } from "react";
import { Button, List, message, Space } from "antd";
const dataEvent = window.dataEvent;

import { Backspace } from "@mui/icons-material";

const electron = window.electron;

export default function LocalConf() {
  const [localDir, setLocalDir] = useState([]);

  //按钮loading
  const [loading, setLoading] = useState(false);

  //下载歌词按钮loading
  const [lrcLoading, setLrcLoading] = useState(false);

  useEffect(() => {
    //查数据
    electron.ipcRenderer.send(dataEvent.eventName.LOCAL_CONF_INIT.value, dataEvent.eventName.LOCAL_CONF_INIT.value);

    //回调
    electron.ipcRenderer.on(dataEvent.eventName.DIR_DATA_CALLBACK.value, (event, files) => {
      setLocalDir(files);
    });

    //回调
    electron.ipcRenderer.on(dataEvent.eventName.SYNC_DATA_CALLBACK.value, (event, data) => {
      setLoading(false);
      message.success("同步成功", 2);
      if (data !== null) {
        electron.ipcRenderer.send(dataEvent.LOCAL.value, dataEvent.LOCAL.value);
      }
    });

    //回调
    electron.ipcRenderer.on(dataEvent.eventName.INSTALL_LRC_CALLBACK.value, () => {
      setLrcLoading(false);
      message.success("下载完成", 2);
    });

    //回调
    electron.ipcRenderer.on(dataEvent.eventName.UPDATE_DIR_CALLBACK.value, () => {
      message.success("更新文件夹数据成功", 2);
    });

    return () => {
      electron.ipcRenderer.removeAllListeners(dataEvent.eventName.DIR_DATA_CALLBACK.value);
      electron.ipcRenderer.removeAllListeners(dataEvent.eventName.SYNC_DATA_CALLBACK.value);
      electron.ipcRenderer.removeAllListeners(dataEvent.eventName.INSTALL_LRC_CALLBACK.value);
      electron.ipcRenderer.removeAllListeners(dataEvent.eventName.UPDATE_DIR_CALLBACK.value);
    };
  }, []);

  //同步数据
  const enterLoading = () => {
    setLoading(true);
    electron.ipcRenderer.send(dataEvent.eventName.SYNC_DATA.value, localDir);
  };

  //传递打开本地文件选择器选项
  const openDirSelect = () => {
    console.log("start");
    electron.ipcRenderer.send(dataEvent.eventName.OPEN_DIR.value, dataEvent.eventName.OPEN_DIR.value);
  };

  //下载歌词
  const installLrc = () => {
    setLrcLoading(true);
    electron.ipcRenderer.send(dataEvent.eventName.INSTALL_LRC.value, localDir);
  };

  //删除文件夹
  const removeDir = (dir) => {
    let data = localDir.filter((item) => item !== dir);
    setLocalDir(data);
    electron.ipcRenderer.send(dataEvent.eventName.UPDATE_DIR.value, data);
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
        renderItem={(item) => (
          <List.Item className="list-item">
            <span>{item}</span>
            <span className="list-item-clear" onClick={() => removeDir(item)}>
              <Backspace />
            </span>
          </List.Item>
        )}
      />
    </Space>
  );
}
