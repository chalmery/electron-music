import React, {useEffect, useState} from 'react'
import {Layout, Menu, Table} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import dataEvent from "../../../electron/lib/event";
import localSetting from "../../../electron/lib/event";


export default function Local() {


    const dirColumn = [{title: 'dir', dataIndex: 'dir', key: 'dir'}];

    const columns = [
        {"title": "名称", "dataIndex": "title", "key": "title"},
        {"title": "作者", "dataIndex": "artist", "key": "artist"},
        {"title": "专辑", "dataIndex": "album", "key": "album"},
        {"title": "类型", "dataIndex": "type", "key": "type"}
    ];

    const [dirList, setDirList] = useState([]);
    const [dataSource, setDataSource] = useState([]);


    const items = [
        // {
        //     label: "本地音乐",
        //     key: "/local",
        // },
        // {
        //     label: "在线歌单",
        //     key: "/online",
        // }
    ];
    const menuClick = (event) => {
        console.log(event)
    };


    useEffect(() => {
        //查数据
        electron.ipcRenderer.send(dataEvent.LOCAL.value, dataEvent.LOCAL.value)

        //回调
        electron.ipcRenderer.on(dataEvent.LOCAL_CALLBACK.value, (event, data) => {
            console.log(data)
            // setLocalDir(files)
        });

        return () => {
            electron.ipcRenderer.removeAllListeners(localSetting.LOCAL_CALLBACK.value);
        };

    }, []);

    return (
        <Layout className='layout centerBg'>
            <Sider className='heightMax centerBg'>
                {dirList.length > 0 && (
                    <Menu
                        className='centerBg'
                        style={{border: 0}}
                        theme="light"
                        mode="inline"
                        items={items}
                        onClick={menuClick}
                    />
                )}
            </Sider>
            <Layout className='rightBg'>
                <Content className='contentStyle'>
                    {dataSource.length > 0 && (
                        <Table
                            rowClassName='rightBg p0'
                            onRow={(record) => {
                                return {
                                    onClick: (event) => {
                                        console.log(record)
                                    }
                                };
                            }}
                            size={"small"}
                            columns={columns}
                            pagination={false}
                            dataSource={dataSource}
                        />
                    )}
                </Content>
            </Layout>
        </Layout>

    )
}