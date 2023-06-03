import React from 'react'
import {Layout, Tabs} from 'antd';
import BaseS from "@/compontes/settings/BaseS";
import LocalS from "@/compontes/settings/LocalS";
import Online from "@/compontes/center/Online";


export default function Settings() {

    const items = [
        {
            label: "基础设置",
            key: "/baseSetting",
            children: <BaseS/>,
        },
        {
            label: "本地设置",
            key: "/localSetting",
            children: <LocalS/>,
        },
        {
            label: "在线设置",
            key: "/onlineSetting",
            children: <Online/>,
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