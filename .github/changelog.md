# Changelog

## [Unreleased]

### 新增：

## [1.2.0] - 2026-04-25

### 新增：
升级 electron 29→41、vite 3→5、react-router-dom 5→7、antd 5→6、music-metadata 7→11 等全部依赖

修复 Electron 安全漏洞：启用 contextIsolation，关闭 nodeIntegration，preload 改用 contextBridge 暴露 API

修复 dataSyncAction 中 fileTypeFromBuffer 未 await 导致图片 MIME 未设置的 bug

修复 fs.js saveSync 错误的回调写法，修复 utils.js instanceof String 判断失效问题

迁移 react-router-dom v7，移除 withRouter/Switch/Redirect，改用 useNavigate/Routes

修复歌词页面专辑图片不显示的问题

修复切换页面后当前播放歌曲高亮丢失、选中目录丢失的问题


### 修改：

* 本地文件列表调整组件，更紧凑

### 修复：

* 修复歌词页面空问题
* 修复左侧边栏css问题[#2](https://github.com/chalmery/electron-music/pull/2)

## [1.1.1] - 2023-07-01

### 新增：

* 本地音乐目录可删除
* 下载歌词拆分为单独按钮

### 修改：

* 下载歌词调整为，下载最匹配的歌词

### 修复：

* 歌词不滚动问题

## [1.1.0] - 2023-06-23

### 新增：

* 歌曲切换功能
* 歌词下载，展示功能
* 进度条，进度条可点击功能
* 歌曲列表，展示歌曲更多信息

### 修改：

* 图标替换为 Material-icon

### 修复：

* 修复歌曲列表，被页脚覆盖问题