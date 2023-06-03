import React from 'react'
import {Layout} from 'antd';
import LeftMenu from "@/compontes/left/LeftMenu";
import {Redirect, Route, Switch} from "react-router-dom";
import Local from "@/compontes/center/Local";
import Online from "@/compontes/center/Online";

const {Footer, Sider, Content} = Layout;

export default function Admin() {


    return (
        <Layout className='layout'>
            <Sider className='siderStyle'>
               <LeftMenu/>
            </Sider>
            <Layout>
                <Content className='contentStyle'>
                    <Switch>
                        < Redirect from="/" exact to="/"/>
                        <Route path="/local" component={Local} />
                        <Route path="/online" component={Online} />
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    )
}