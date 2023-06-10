import React, {useEffect, useState} from 'react'
import {Layout, Menu, Table} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content} from "antd/es/layout/layout";
import dataEvent from "../../../electron/lib/event";
import localSetting from "../../../electron/lib/event";

const MenuItem = Menu.Item;


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

    const menuClick = (item, key, keyPath, domEvent) => {
        console.log(item)
        console.log(key)
        console.log(keyPath)
        console.log(domEvent)
    };


    useEffect(() => {
        //查数据
        electron.ipcRenderer.send(dataEvent.LOCAL.value, dataEvent.LOCAL.value)

        //回调
        electron.ipcRenderer.on(dataEvent.LOCAL_CALLBACK.value, (event, data) => {
            setDirList(data)
        });

        return () => {
            electron.ipcRenderer.removeAllListeners(localSetting.LOCAL_CALLBACK.value);
        };

    }, []);

    const handleMenuClick = ({key}) => {
        const selectedItem = dirList.find((item) => item.key === key);
        if (selectedItem) {
            const {value} = selectedItem;
            console.log('Clicked item value:', value);
            // 在这里处理菜单项点击事件，可以获取当前行对应的 value 值
        }
    };

    const renderMenuItems = () => {
        return dirList.map((item) => (
            <MenuItem key={item.key}>{item.label}</MenuItem>
        ));
    };

    const menuItems = renderMenuItems();

    return (
        <Layout className='layout centerBg'>
            <Sider className='heightMax centerBg'>
                {dirList.length > 0 && (
                    <Menu
                        className='centerBg'
                        style={{border: 0}}
                        theme="light"
                        mode="inline"
                        onClick={handleMenuClick}
                    >
                        {menuItems}
                    </Menu>

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