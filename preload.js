const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Get current settings
    getSettings: () => ipcRenderer.invoke('get-settings'),

    // Save settings
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),

    // Restart the application
    restartApp: () => ipcRenderer.invoke('restart-app'),

    // Open URL in external browser
    openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
