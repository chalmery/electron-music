import React, {useState} from 'react'
import {Button, List, Space} from "antd";

export default function LocalConf() {
    const localPaths = [
        "1",
        "2"
    ]

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


    return (
        <Space direction="vertical"  className={'widthMax'}>
           <Space direction="horizontal">
               <Button type="primary">选择目录</Button>
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