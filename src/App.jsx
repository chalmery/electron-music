import Admin from "./compontes/Admin";
import {HashRouter, Route, Switch} from "react-router-dom"
import zhCN from 'antd/locale/zh_CN';
import {ConfigProvider} from "antd";
import {createTheme, ThemeProvider} from '@mui/material/styles';

// 创建自定义主题
const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 16, // 设置图标的大小
        },
      },
    },
  },
});

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <ThemeProvider theme={theme}>
        <HashRouter>
          <Switch>
            <Route path="/" component={Admin}/>
          </Switch>
        </HashRouter>
      </ThemeProvider>
    </ConfigProvider>
  );
}