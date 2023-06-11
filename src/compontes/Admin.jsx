import React from 'react'
import {Layout} from 'antd';
import LeftMenu from "@/compontes/left/LeftMenu";
import {Redirect} from "react-router-dom";
import Local from "@/compontes/center/Local";
import Online from "@/compontes/center/Online";
import {CacheRoute, CacheSwitch} from 'react-router-cache-route';

const {Footer, Sider, Content} = Layout;

export default function Admin() {


    return (
        <Layout className='layout '>
            <Sider className='siderStyle'>
                <LeftMenu/>
            </Sider>
            <Content className="heightMax">
                <CacheSwitch>
                    < Redirect from="/" exact to="/"/>
                    <CacheRoute path="/local" component={Local}/>
                    <CacheRoute path="/online" component={Online}/>
                </CacheSwitch>
            </Content>
        </Layout>
    )
}