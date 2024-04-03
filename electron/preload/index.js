import {contextBridge, ipcRenderer} from "electron";


contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  send(...args) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  removeAllListeners(...args) {
    const [channel] = args
    return ipcRenderer.removeAllListeners(channel)
  },
})


function domReady(condition = ['complete', 'interactive']) {
  return new Promise(resolve => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}



import * as utilModule from '../lib/util/utils';
import * as dataEvent from '../lib/metadata/event';
// import electron from 'electron';
import fs from 'fs';

/**
 * dom准备完毕
 */
domReady().then(() => {
  window.fs = fs
  window.utils = utilModule
  window.dataEvent = dataEvent
});

