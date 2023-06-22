import React, {useEffect, useRef, useState} from 'react'
import {Layout, Menu, Table} from "antd";
import dataEvent from "../../../electron/lib/event";
import localSetting from "../../../electron/lib/event";
import eventManager from '../../event/eventManager';
import pageEvent from "@/event/pageEvent";
import {playModeRepository} from "@/strategy/repository/repository";
import icon from '/icons/music256x256.png';

const {Content, Sider} = Layout;


export default function Local() {
    const columns = [
        {
            "title": "歌曲", "dataIndex": "picture", "key": "picture",
            render: (picture) => {
                let img = picture === null ? icon : `file://${picture}`
                return <img src={img} alt={icon} style={{width: '35px', borderRadius: "2px"}}/>
            }
        },
        {"title": "歌曲", "dataIndex": "title", "key": "title"},
        {"title": "歌手", "dataIndex": "artist", "key": "artist"},
        {"title": "专辑", "dataIndex": "album", "key": "album"},
        {"title": "时长", "dataIndex": "duration", "key": "duration"},
        {"title": "类型", "dataIndex": "type", "key": "type"}
    ];

    const [dirList, setDirList] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const dirListRef = useRef(dirList);
    const [thisMusic, setThisMusic] = useState(null);

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

        //上一首
        eventManager.subscribe(pageEvent.PRE.value, handlePre);

        // 取消订阅
        return () => {
            electron.ipcRenderer.removeAllListeners(localSetting.LOCAL_CALLBACK.value);
            eventManager.unsubscribe(pageEvent.NEXT.value, handleNext);
            eventManager.unsubscribe(pageEvent.PRE.value, handlePre);
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
     * 上一首事件处理
     * @param data 当前音乐元数据
     */
    const handlePre = (data) => {
        //策略
        let {playMode} = data;
        let fun = playModeRepository.get(playMode);
        const newData = {
            ...data,
            dirList: dirListRef.current,
            type: pageEvent.PRE,
            call: setThisMusic
        };
        fun(newData);
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
            type: pageEvent.NEXT,
            call: setThisMusic
        };
        fun(newData);
    }


    const rowClassName = (record, index) => {
        if (thisMusic) {
            return thisMusic === record ? 'highlight-row,color-row' : ''
        }
        return ''
    };

    return (
      <Layout className='layout'>
          <Sider className='scrollable-container auto'>
              {dirList.length > 0 && (<>
                    <Menu
                      className='border0'
                      theme="light"
                      mode="inline"
                      items={dirList}
                      onClick={handleMenuClick}
                    >
                    </Menu>
                    <div style={{height: "55px"}}></div>
                </>
                )}
            </Sider>

            <Content className='scrollable-container auto heightMax'>
                {dataSource.length > 0 && (<>
                      <Table
                        onRow={(record) => {
                            return {
                                onClick: (event) => {
                                    setThisMusic(record)
                                    eventManager.publish(pageEvent.CLICK_MUSIC.value, record);
                                }
                            };
                        }}
                        rowClassName={rowClassName}
                        size={"small"}
                        columns={columns}
                        pagination={false}
                        dataSource={dataSource}
                      />
                      <div style={{height: "55px"}}></div>
                    </>
                )}

            </Content>


        </Layout>

    )
}