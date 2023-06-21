import React, {useState} from 'react'
import {Button, Input, List, Radio, Space} from "antd";

export default function OnlineConf() {

    const [value, setValue] = useState(1);
    const onChange = (e) => {
        setValue(e.target.value);
    };

    const localPaths = [
        "1",
        "2"
    ]

    return (
        <Space direction="vertical" className={'widthMax'}>
            导入歌单：
            <Radio.Group onChange={onChange} value={value}>
                <Radio value={1}>网易云音乐</Radio>
                <Radio value={2}>QQ音乐</Radio>
                <Radio value={3}>虾米音乐</Radio>
                <Radio value={4}>咪咕音乐</Radio>
                <Radio value={5}>其他</Radio>
            </Radio.Group>
            <Input addonBefore="http://"/>
            <Space direction="horizontal">
                <Button type="primary">识别歌单</Button>
                <Button type="primary">立即导入</Button>
            </Space>

            <List
                size="small"
                header={<div>歌单列表</div>}
                bordered
                dataSource={localPaths}
                renderItem={(item) => <List.Item>{item}</List.Item>}
            />
        </Space>
    )
}