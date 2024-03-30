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

/**
 * dom准备完毕
 */
domReady().then(() => {
  window.electron = require('electron')
  window.fs = require('fs')
  window.utils = utilModule
  window.dataEvent = dataEvent
});


