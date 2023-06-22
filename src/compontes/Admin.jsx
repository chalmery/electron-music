import React, {useState} from "react";

import LeftMenu from "@/compontes/left/LeftMenu";
import {Redirect} from "react-router-dom";
import Local from "@/compontes/center/Local";
import Online from "@/compontes/center/Online";
import {CacheRoute, CacheSwitch} from "react-router-cache-route";
import {Layout} from "antd";
import MyFooter from "@/compontes/footer/MyFooter";
import Playlist from "@/compontes/center/Playlist";
import Love from "@/compontes/center/Love";
import Lyrics from "@/compontes/footer/Lyrics";

const {Footer, Sider, Content} = Layout;

export default function Admin() {
  const [showDiv, setShowDiv] = useState(false);

  const handleStatusChange = (newStatus) => {
    setShowDiv(newStatus);

  };
  return (

    <Layout>
      {showDiv && <Lyrics style={{position: "absolute", zIndex: 100, width: "100vh"}}/>}
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
      <Footer style={{width: "100%", position: "absolute", zIndex: 2, bottom: 0, padding: 0, margin: 0}}>
        <MyFooter onStatusChange={handleStatusChange}/>
      </Footer>
    </Layout>
  );
}
