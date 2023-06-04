import React from 'react'
import {Layout, Tabs} from 'antd';
import BaseConf from "@/compontes/settings/BaseConf";
import LocalConf from "@/compontes/settings/LocalConf";
import About from "@/compontes/settings/About";
import OnlineConf from "@/compontes/settings/OnlineConf";


export default function Settings() {

    const items = [
        {
            label: "基础设置",
            key: "/baseSetting",
            children: <BaseConf/>,
        },
        {
            label: "本地设置",
            key: "/localSetting",
            children: <LocalConf/>,
        },
        {
            label: "在线设置",
            key: "/onlineSetting",
            children: <OnlineConf/>,
        },
        {
            label: "关于",
            key: "/about",
            children: <About/>,
        }
    ];


    return (
        <Layout className='layout' style={{backgroundColor: "#ffffff", height: "300px"}}>
            <Tabs
                tabPosition={'left'}
                items={items}
            />
        </Layout>
    )
}