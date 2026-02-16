const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    showMessage: () => console.log('API desde preload.js'),
    saveConfig: (data) => ipcRenderer.invoke('save-config', data),
    getConfig: () => ipcRenderer.invoke('get-config')
});
