import Admin from "./compontes/Admin";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from "antd";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          fontSize: 16,
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
          <Routes>
            <Route path="/*" element={<Admin />} />
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </ConfigProvider>
  );
}
