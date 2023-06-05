import React, {useEffect, useState} from 'react'
import {Button, List, Space} from "antd";
import localSetting from '../../../electron/lib/event.js'

const electron = window.electron

export default function LocalConf() {
    const [localDir, setLocalDir] = useState();

    useEffect(() => {
        //查数据
        electron.ipcRenderer.send(localSetting.LOCAL_CONF_INIT.value, localSetting.LOCAL_CONF_INIT.value)

        electron.ipcRenderer.on(localSetting.DIR_DATA_CALLBACK.value, (event, files) => {
            console.log("回调对象" + files)
            setLocalDir(files)
        });

        // Clean the listener after the component is dismounted
        return () => {
            electron.ipcRenderer.removeAllListeners(localSetting.DIR_DATA_CALLBACK.value);
        };
    }, []);
    //按钮loading
    const [loadings, setLoadings] = useState([]);


    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = true;
            return newLoadings;
        });
        setTimeout(() => {
            setLoadings((prevLoadings) => {
                const newLoadings = [...prevLoadings];
                newLoadings[index] = false;
                return newLoadings;
            });
        }, 6000);
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
                <Button loading={loadings[0]}
                        onClick={() => enterLoading(0)}> 同步数据 < /Button>
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