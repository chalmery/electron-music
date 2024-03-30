function domReady(condition = ['complete', 'interactive']) {
    return new Promise(resolve => {
        if (condition.includes(document.readyState)) {
            resolve(true);
        }
        else {
            document.addEventListener('readystatechange', () => {
                if (condition.includes(document.readyState)) {
                    resolve(true);
                }
            });
        }
    });
}

domReady().then(() => {
    window.electron = require('electron')
    console.log('electron finish...')
    window.fs = require('fs')
    console.log('electron fs finish...')
});


