import React, {useState} from 'react'
import {Divider, Image, Menu, Modal} from 'antd';
import {CloudOutlined, CustomerServiceTwoTone} from '@ant-design/icons';
import Settings from "@/compontes/settings/Settings";
import {withRouter} from "react-router-dom";
import dog from '/dog.jpg';

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
  },
  {
    label: "播放列表",
    key: "/playlist",
    icon: <CloudOutlined/>,
  }
];


const LeftMenu = (props) => {
  //模态框展示状态
  const [open, setOpen] = useState(false)

  const menuClick = (event) => {
    props.history.push(event.key)
  };


  return (
    <div className={'leftBg heightMax'}>
      <div className={'center'}>
        <Image
          width={70}
          onClick={() => {
            setOpen(true)
          }}
          src={dog}
          preview={false}
        />
      </div>
      <Divider/>
      <Menu
        style={{border: 0}}
        theme="light"
        mode="inline"
        items={items}
        onClick={menuClick}
      />
      <Modal
        bodyStyle={{height: '100%', overflowY: 'auto'}}
        width={'80%'}
        title="设置"
        open={open}
        footer={null}
        onCancel={() => {
          setOpen(false);
        }}
      >

        <Settings/>
      </Modal>
    </div>
  )
}

export default withRouter(LeftMenu);