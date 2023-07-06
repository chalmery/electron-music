import React, {useState} from "react";

import LeftMenu from "@/compontes/left/LeftMenu";
import {Redirect} from "react-router-dom";
import Local from "@/compontes/center/Local";
import Online from "@/compontes/center/Online";
import {CacheRoute, CacheSwitch} from "react-router-cache-route";
import {Layout} from "antd";
import MusicBar from "@/compontes/footer/Footer";
import Playlist from "@/compontes/center/Playlist";
import Love from "@/compontes/center/Love";
import Lyrics from "@/compontes/footer/Lyrics";

const {Footer, Sider, Content} = Layout;

export default function Admin() {
  //是否展示歌词页面
  const [show, setShow] = useState(false)

  const [metadata, setMetadata] = useState(null)

  const handleStatusChange = (status, metadata) => {
    setShow(status)
    setMetadata(metadata)
  }

  return (
    <div>
      <Lyrics show={show} metadata={metadata}/>
      <Layout>
        <Sider>
          <LeftMenu/>
        </Sider>
        <Content>
          <CacheSwitch>
            <Redirect from="/" exact to="/"/>
            <CacheRoute path="/local" component={Local} style={{flex: 1}}/>
            <CacheRoute path="/online" component={Online}/>
            <CacheRoute path="/playlist" component={Playlist}/>
            <CacheRoute path="/love" component={Love}/>
          </CacheSwitch>
        </Content>
        <Footer className="footer">
          <MusicBar onStatusChange={handleStatusChange}/>
        </Footer>
      </Layout>
    </div>
  );
}
