const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
    showMessage: () => console.log('API desde preload.js')
});
