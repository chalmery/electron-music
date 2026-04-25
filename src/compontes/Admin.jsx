import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LeftMenu from "@/compontes/left/LeftMenu";
import Local from "@/compontes/center/Local";
import Online from "@/compontes/center/Online";
import { Layout } from "antd";
import MusicBar from "@/compontes/footer/Footer";
import Playlist from "@/compontes/center/Playlist";
import Love from "@/compontes/center/Love";
import Lyrics from "@/compontes/footer/Lyrics";

const { Footer, Sider, Content } = Layout;

export default function Admin() {
  const [show, setShow] = useState(false);
  const [metadata, setMetadata] = useState(null);

  const handleStatusChange = (status, metadata) => {
    setShow(status);
    setMetadata(metadata);
  };

  return (
    <div>
      <Lyrics show={show} metadata={metadata} />
      <Layout>
        <Sider>
          <LeftMenu />
        </Sider>
        <Content>
          <Routes>
            <Route path="/" element={<Navigate to="/local" replace />} />
            <Route path="/local" element={<Local />} />
            <Route path="/online" element={<Online />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/love" element={<Love />} />
          </Routes>
        </Content>
        <Footer className="footer">
          <MusicBar onStatusChange={handleStatusChange} />
        </Footer>
      </Layout>
    </div>
  );
}
