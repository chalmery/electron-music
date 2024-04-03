import React, {useState} from "react";

// import { Route} from "react-router-dom";
// import Local from "@/compontes/center/Local";
// import Online from "@/compontes/center/Online";
import {Layout} from "antd";
// import MusicBar from "@/compontes/footer/Footer";
// import Playlist from "@/compontes/center/Playlist";
// import Love from "@/compontes/center/Love";
// import Lyrics from "@/compontes/footer/Lyrics";
// import LeftMenu from "@/compontes/left/LeftMenu";

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

      你好世界
      {/*<Lyrics show={show} metadata={metadata}/>*/}
      {/*<Layout>*/}
      {/*  <Sider>*/}
      {/*    <LeftMenu/>*/}
      {/*  </Sider>*/}
      {/*  <Content>*/}
      {/*    <Route from="/" exact to="/"/>*/}
      {/*    <Route path="/local" component={Local} style={{flex: 1}}/>*/}
      {/*    <Route path="/online" component={Online}/>*/}
      {/*    <Route path="/playlist" component={Playlist}/>*/}
      {/*    <Route path="/love" component={Love}/>*/}
      {/*  </Content>*/}
      {/*  <Footer className="footer">*/}
      {/*    <MusicBar onStatusChange={handleStatusChange}/>*/}
      {/*  </Footer>*/}
      {/*</Layout>*/}
    </div>
  );
}
