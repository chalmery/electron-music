import React, {useEffect, useRef, useState} from 'react'
import {Layout, Menu, Table} from "antd";
import dataEvent from "../../../electron/lib/event";
import localSetting from "../../../electron/lib/event";
import eventManager from '../../event/eventManager';
import pageEvent from "@/event/pageEvent";
import {playModeRepository} from "@/strategy/repository/repository";

const {Content, Sider} = Layout;


export default function Local() {
    const columns = [
        {"title": "歌曲", "dataIndex": "title", "key": "title"},
        {"title": "歌手", "dataIndex": "artist", "key": "artist"},
        {"title": "专辑", "dataIndex": "album", "key": "album"},
        {"title": "类型", "dataIndex": "type", "key": "type"}
    ];

    const [dirList, setDirList] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const dirListRef = useRef(dirList);

    useEffect(() => {
        //查数据
        electron.ipcRenderer.send(dataEvent.LOCAL.value, dataEvent.LOCAL.value)

        //回调
        electron.ipcRenderer.on(dataEvent.LOCAL_CALLBACK.value, (event, data) => {
            setDirList(data)
            dirListRef.current = data
        });


        //下一首
        eventManager.subscribe(pageEvent.NEXT.value, handleNext);

        // 取消订阅
        return () => {
            electron.ipcRenderer.removeAllListeners(localSetting.LOCAL_CALLBACK.value);
            eventManager.unsubscribe(pageEvent.NEXT.value, handleNext);

        };

    }, []);


    const handleMenuClick = ({key}) => {
        const selectedItem = dirList.find((item) => item.key === key);
        if (selectedItem) {
            const {value} = selectedItem;
            setDataSource(value)
        }
    }

    /**
     * 下一首事件处理
     * @param data 当前音乐元数据
     */
    const handleNext = (data) => {
        //策略
        let {playMode} = data;
        let fun = playModeRepository.get(playMode);
        const newData = {
            ...data,
            dirList: dirListRef.current,
        };
        fun(newData);
    }

    return (
      <Layout className='layout'>
          <Sider className='scrollable-container auto'>
              {dirList.length > 0 && (
                <Menu
                  className='border0'
                  theme="light"
                  mode="inline"
                  items={dirList}
                    onClick={handleMenuClick}
                  >
                  </Menu>
                )}
            </Sider>

            <Content className='scrollable-container auto heightMax'>
                {dataSource.length > 0 && (<>
                      <Table
                        onRow={(record) => {
                            return {
                                onClick: (event) => {
                                    eventManager.publish(pageEvent.CLICK_MUSIC.value, record);
                                }
                            };
                        }}
                        bordered={true}
                            size={"small"}
                            columns={columns}
                            pagination={false}
                            dataSource={dataSource}
                        />
                        <div style={{height: "54px"}}></div>
                    </>
                )}

            </Content>


        </Layout>

    )
}