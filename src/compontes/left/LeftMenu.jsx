import React, {useState} from 'react'
import {Divider, Image, Menu, Modal} from 'antd';
import {CloudOutlined, CustomerServiceTwoTone} from '@ant-design/icons';
import Settings from "@/compontes/settings/Settings";
import {withRouter} from "react-router-dom";


const items = [
    {
        label: "本地音乐",
        key: "/local",
        icon: <CustomerServiceTwoTone/>,
    },
    {
        label: "在线歌单",
        key: "/online",
        icon: <CloudOutlined/>,
    }
];


const LeftMenu = (props) => {
    //模态框展示状态
    const [open, setOpen] = useState(false)

    const ok = () => {
        setOpen(false)
        console.log("ok")
    };

    const menuClick = (event) => {
        props.history.push(event.key)
    };


    return (
        <div className={'background heightMax'}>
            <div className={'center'}>
                <Image
                    width={70}
                    onClick={() => {setOpen(true)}}
                    src="../../../public/dog.jpg"
                    preview={false}
                />
            </div>
            <Divider/>
            <Menu
                theme="light"
                mode="vertical"
                items={items}
                onClick={menuClick}
            />
            <Modal
                width={'800px'}
                title="设置"
                open={open}
                onOk={ok}
                onCancel={() => {
                    setOpen(false);
                }}
            >

               <Settings />
            </Modal>
        </div>
    )
}

export default withRouter(LeftMenu);