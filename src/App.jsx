import Admin from "./compontes/Admin";
import {HashRouter, Route, Switch} from "react-router-dom"
import zhCN from 'antd/locale/zh_CN';
import {ConfigProvider} from "antd";

export default function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <HashRouter>
                <Switch>
                    <Route path="/" component={Admin} />
                </Switch>
            </HashRouter>
        </ConfigProvider>
    );
}