import {app, BrowserWindow, Menu, nativeImage, Tray} from 'electron'
import {dirname, join} from 'node:path'
import {listen} from "../listen/listen";
import {eventName} from "../lib/metadata/event";
import {fileURLToPath} from "node:url";

globalThis.__filename = fileURLToPath(import.meta.url)
globalThis.__dirname = dirname(__filename)

process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

/**
 * process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
 */

let mainWindow;
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");
const preload = join(__dirname, "../preload/index.mjs");

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Install `react-devtools`
// if (app.isPackaged === false) {
//   app.whenReady().then(() => {
//     import {default: installExtension, REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
//
//     installExtension(REACT_DEVELOPER_TOOLS)
//       .then(() => {
//       })
//       .catch((err) => {
//         console.error("Unable to install `react-devtools`: \n", err);
//       });
//   });
// }

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 618,
    width: 1000,
    maximizable: true,
    fullscreen: false,
    title: "Electron Music",
    icon: [
      join(process.env.VITE_PUBLIC, "icons/music.png"),
      join(process.env.VITE_PUBLIC, "icons/music@2x.png"),
      join(process.env.VITE_PUBLIC, "icons/music@3x.png"),
      join(process.env.VITE_PUBLIC, "icons/music@4x.png"),
      join(process.env.VITE_PUBLIC, "icons/music@5x.png"),
      join(process.env.VITE_PUBLIC, "icons/music@6x.png"),
    ],
    webPreferences: {
      preload,
      // webviewTag: true,
      // webSecurity: true, // 启用安全策略
      // nodeIntegration: true,
      // enableRemoteModule: true,
      // contextIsolation: false,
      // nodeIntegrationInSubFrames: true,
    },
  });
  loadFile();
}

function loadFile() {
  if (app.isPackaged) {
    mainWindow.loadFile(indexHtml);
    // add shortcut for open devtools (F12 or Ctrl+Shift+I)
    mainWindow.webContents.on("before-input-event", (event, input) => {
      if (input.key.toLowerCase() === "f12" || (input.control && input.shift && input.key.toLowerCase() === "i")) {
        mainWindow.webContents.openDevTools();
        event.preventDefault();
      }
    });
  } else {
    mainWindow.loadURL(url);
    // add shortcut for open devtools (F12 or Ctrl+Shift+I)
    mainWindow.webContents.on("before-input-event", (event, input) => {
      if (input.key.toLowerCase() === "f12" || (input.control && input.shift && input.key.toLowerCase() === "i")) {
        mainWindow.webContents.openDevTools();
        event.preventDefault();
      }
    });
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  const icon = nativeImage.createFromPath(join(process.env.VITE_PUBLIC, "icons/music@6x.png"));
  const resizedIcon = icon.resize({width: 128, height: 128});
  let tray = new Tray(resizedIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "播放/暂停",
      click: () => {
        mainWindow.webContents.send(eventName.PLAY.value, eventName.PLAY.value);
      },
    },
    {
      label: "上一首",
      click: () => {
        mainWindow.webContents.send(eventName.PRE.value, eventName.PRE.value);
      },
    },
    {
      label: "下一首",
      click: () => {
        mainWindow.webContents.send(eventName.NEXT.value, eventName.NEXT.value);
      },
    },
    {
      label: "显示",
      click: () => {
        mainWindow.show(); // 显示窗口
      },
    },
    {
      label: "退出",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  tray.setToolTip("Electron-Music");
});

app.on("browser-window-created", function (e, window) {
  window.setMenu(null);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

listen();
