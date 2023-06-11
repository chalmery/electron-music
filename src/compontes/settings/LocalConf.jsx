import React, {useEffect, useState} from 'react'
import {Button, List, message, Space} from "antd";
import localSetting from '../../../electron/lib/event.js'
import dataEvent from "../../../electron/lib/event";

const electron = window.electron

export default function LocalConf() {
  const [localDir, setLocalDir] = useState();

  //按钮loading
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //查数据
    electron.ipcRenderer.send(localSetting.LOCAL_CONF_INIT.value, localSetting.LOCAL_CONF_INIT.value)

    //回调
    electron.ipcRenderer.on(localSetting.DIR_DATA_CALLBACK.value, (event, files) => {
      setLocalDir(files)
    });

    //回调
    electron.ipcRenderer.on(localSetting.SYNC_DATA_CALLBACK.value, (event, data) => {
      setLoading(false)
      message.success('同步成功', 2);
      if (data !== null) {
        electron.ipcRenderer.send(dataEvent.LOCAL.value, dataEvent.LOCAL.value)
      }
    });


    // Clean the listener after the component is dismounted
    return () => {
      electron.ipcRenderer.removeAllListeners(localSetting.DIR_DATA_CALLBACK.value);
      electron.ipcRenderer.removeAllListeners(localSetting.SYNC_DATA_CALLBACK.value);
    };
  }, []);

  //同步数据
  const enterLoading = () => {
    setLoading(true)
    electron.ipcRenderer.send(localSetting.SYNC_DATA.value, localDir)
  };

  //传递打开本地文件选择器选项
  const openDirSelect = () => {
    console.log("start")
    electron.ipcRenderer.send(localSetting.OPEN_DIR.value, localSetting.OPEN_DIR.value)
  };


  return (
    <Space direction="vertical" className={'widthMax'}>
      <Space direction="horizontal">
        <Button type="primary" onClick={openDirSelect}>选择目录</Button>
        <Button loading={loading}
                onClick={enterLoading}> 同步数据 < /Button>
      </Space>
      <List
        size="small"
        header={<div>本地音乐文件目录</div>}
        bordered
        dataSource={localDir}
        renderItem={(item) => <List.Item>{item}</List.Item>}
      />
    </Space>
  )
}