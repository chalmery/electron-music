import React, {useEffect, useState} from 'react'
import {Avatar, Layout, Menu, Progress, Space, Table} from "antd";
import dataEvent from "../../../electron/lib/event";
import localSetting from "../../../electron/lib/event";
import {UserOutlined} from '@ant-design/icons';

const {Footer, Content, Sider} = Layout;


export default function Local() {
    const columns = [
        {"title": "歌曲", "dataIndex": "title", "key": "title"},
        {"title": "歌手", "dataIndex": "artist", "key": "artist"},
        {"title": "专辑", "dataIndex": "album", "key": "album"},
        {"title": "类型", "dataIndex": "type", "key": "type"}
    ];

    const [dirList, setDirList] = useState([]);
    const [dataSource, setDataSource] = useState([]);


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
            setDataSource(value)
        }
    }

    return (
        <Layout className='layout heightMax'>
            <Sider className='heightMax leftBg'>
                {dirList.length > 0 && (
                    <Menu
                        className='centerBg'
                        style={{border: 0}}
                        theme="light"
                        mode="inline"
                        items={dirList}
                        onClick={handleMenuClick}
                    >
                    </Menu>
                )}
            </Sider>
            <Layout className={'rightLayout'}>
                <Content className={'content'}>
                    {dataSource.length > 0 && (
                        <Table
                            onRow={(record) => {
                                return {
                                    onClick: (event) => {
                                        console.log(record)
                                    }
                                };
                            }}
                            bordered={true}
                            size={"small"}
                            columns={columns}
                            pagination={false}
                            dataSource={dataSource}
                        />
                    )}
                </Content>
                <Footer className={'widthMax p0 footer'}>
                    <Space direction="horizontal" className={'widthMax'}>
                        <Avatar shape="square" size={48} icon={<UserOutlined/>}/>
                        <Space direction="vertical" className={'widthMax'}>
                            <span>歌曲名称  111111111111111111111111111111</span>
                            <span>00:00/00:00</span>
                            <Progress size={'small'} className={'widthMax'}/>
                        </Space>
                    </Space>
                </Footer>
            </Layout>
        </Layout>

    )
}