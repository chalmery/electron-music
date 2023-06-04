import React, {useState} from 'react'
import {Button, List, Space} from "antd";
const electron  = window.electron

import eventType from '../../../electron/lib/event.js'

export default function LocalConf() {
    const localPaths = [
        "1",
        "2"
    ]
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
        electron.ipcRenderer.send(eventType.OPEN_DIR.value, eventType.OPEN_DIR.value)
    };


    return (
        <Space direction="vertical"  className={'widthMax'}>
           <Space direction="horizontal">
               <Button type="primary" onClick={openDirSelect}>选择目录</Button>
               <Button loading={loadings[0]}
                       onClick={() => enterLoading(0)}> 同步数据 < /Button>
           </Space>
            <List
                size="small"
                header={<div>本地音乐文件目录</div>}
                bordered
                dataSource={localPaths}
                renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        </Space>
    )
}