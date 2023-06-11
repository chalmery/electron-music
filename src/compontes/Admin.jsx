import React from "react";

import LeftMenu from "@/compontes/left/LeftMenu";
import {Redirect} from "react-router-dom";
import Local from "@/compontes/center/Local";
import Online from "@/compontes/center/Online";
import {CacheRoute, CacheSwitch} from "react-router-cache-route";
import {Layout} from "antd";
import MyFooter from "@/compontes/footer/MyFooter";

const {Footer, Sider, Content} = Layout;

export default function Admin() {
    return (
        <Layout>
            <Sider>
                <LeftMenu/>
            </Sider>
            <Content style={{position: "relative", height: "100vh", overflow: 'hidden',}}>
                <CacheSwitch>
                    <Redirect from="/" exact to="/"/>
                    <CacheRoute path="/local" component={Local} style={{flex: 1}}/>
                    <CacheRoute path="/online" component={Online}/>
                </CacheSwitch>
                <Footer style={{width: "100%", position: "absolute", bottom: 0, padding: 0, margin: 0,}}>
                    <MyFooter/>
                </Footer>
            </Content>
        </Layout>
    );
}
