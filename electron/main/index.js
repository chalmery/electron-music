const {app, BrowserWindow, Tray, Menu, nativeImage} = require('electron')
const {join} = require('path')

process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let mainWindow
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')

import {listen} from "../listen/listen";


if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Install `react-devtools`
if (app.isPackaged === false) {
  app.whenReady().then(() => {
    const {default: installExtension, REACT_DEVELOPER_TOOLS} = require('electron-devtools-installer');

    installExtension(REACT_DEVELOPER_TOOLS)
      .then(() => {
      })
      .catch(err => {
        console.error('Unable to install `react-devtools`: \n', err)
      })
  })
}

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 618,
    width: 1000,
    maximizable: false,
    fullscreen: false,
    title: '',
    icon: [
      join(process.env.PUBLIC, 'icons/music.png'),
      join(process.env.PUBLIC, 'icons/music@3x.png'),
      join(process.env.PUBLIC, 'icons/music128x128.png'),
      join(process.env.PUBLIC, 'icons/icon256x256.png'),
    ],
    webPreferences: {
      preload,
      webviewTag: true,
      webSecurity: false, // 禁用安全策略
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nodeIntegrationInSubFrames: true
    }
  })
  loadFile();
}

function loadFile() {
  if (app.isPackaged) {
    mainWindow.loadFile(indexHtml)
    // add shortcut for open devtools (F12 or Ctrl+Shift+I)
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if ((input.key.toLowerCase() === 'f12') || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
        mainWindow.webContents.openDevTools()
        event.preventDefault()
      }
    })
  } else {
    mainWindow.loadURL(url)
    // add shortcut for open devtools (F12 or Ctrl+Shift+I)
    mainWindow.webContents.on('before-input-event', (event, input) => {
      if ((input.key.toLowerCase() === 'f12') || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
        mainWindow.webContents.openDevTools()
        event.preventDefault()
      }
    })
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}


app.whenReady().then(() => {
  createWindow()

  //
  const icon = nativeImage.createFromPath(join(process.env.PUBLIC, '/icons/music.png'))
  let tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {label: '播放', type: 'radio'},
    {label: '上一首', type: 'radio'},
    {label: '下一首', type: 'radio', checked: true},
    {label: '退出', type: 'radio'}
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('This is my application')
  tray.setTitle('This is my title')
})

app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

listen()
