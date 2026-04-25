import React, { useState } from 'react';
import { Divider, Image, Menu, Modal } from 'antd';
import Settings from "@/compontes/settings/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import icon from '/icons/music@6x.png';
import { CloudQueue, FavoriteBorder, Headset, LibraryMusic } from '@mui/icons-material';

const items = [
  { label: "本地音乐", key: "/local", icon: <LibraryMusic /> },
  { label: "在线歌单", key: "/online", icon: <CloudQueue /> },
  { label: "播放列表", key: "/playlist", icon: <Headset /> },
  { label: "我喜欢的", key: "/love", icon: <FavoriteBorder /> },
];

const LeftMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuClick = (event) => {
    navigate(event.key);
  };

  return (
    <div className={'leftBg heightMax'}>
      <div className={'center'}>
        <Image
          width={70}
          onClick={() => setOpen(true)}
          src={icon}
          preview={false}
        />
      </div>
      <Divider />
      <Menu
        style={{ border: 0 }}
        theme="light"
        mode="inline"
        items={items}
        selectedKeys={[location.pathname]}
        onClick={menuClick}
      />
      <Modal
        styles={{ body: { height: '60vh', overflowY: 'auto' } }}
        width={'80%'}
        title="设置"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <Settings />
      </Modal>
    </div>
  );
};

export default LeftMenu;
