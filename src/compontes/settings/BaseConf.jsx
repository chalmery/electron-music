import React from 'react'
import {Checkbox, Divider, Space} from "antd";


function BaseConf() {

    const startOnChange = (value) => {
        console.log(`startOnChange ${value}`);
    };
    const slowOnChange = (value) => {
        console.log(`slowOnChange ${value}`);
    };

    const sowingOnChange = (value) => {
        console.log(`sowingOnChange ${value}`);
    };

    const progressOnChange = (value) => {
        console.log(`progressOnChange ${value}`);
    };

    return (
        <Space direction="vertical" className={'widthMax'}>
            <span>常规：</span>
            <Checkbox onChange={startOnChange}>开机自启</Checkbox>
            <Checkbox onChange={slowOnChange}>最小化到系统托盘</Checkbox>
            <Divider/>
            <span>播放：</span>
            <Checkbox onChange={sowingOnChange}>启动时自动播放</Checkbox>
            <Checkbox onChange={progressOnChange}>程序启动时记录上次播放进度</Checkbox>
        </Space>
    )
}

export default BaseConf
