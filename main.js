const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize settings store
const store = new Store({
    defaults: {
        targetUrl: 'https://github.com/Saarthaksr7/Guacamole-rapper',
        hardwareAcceleration: true,
        networkPriority: false
    }
});

let mainWindow;
let settingsWindow;

// Apply hardware acceleration setting BEFORE app is ready
if (!store.get('hardwareAcceleration')) {
    app.disableHardwareAcceleration();
}

function createMainWindow() {
    const targetUrl = store.get('targetUrl');
    const networkPriority = store.get('networkPriority');

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webviewTag: true, // Enable webview tag
            // Apply network priority setting
            backgroundThrottling: !networkPriority
        },
        icon: path.join(__dirname, 'icon.png'),
        title: 'Guacamole Wrapper',
        autoHideMenuBar: false
    });

    // Load the index.html which contains the webview
    mainWindow.loadFile('index.html');

    // Create application menu
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Settings',
                    accelerator: 'CmdOrCtrl+,',
                    click: () => {
                        createSettingsWindow();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.reload();
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    accelerator: 'Alt+F4',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: 'F12',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.toggleDevTools();
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'F11',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.setFullScreen(!mainWindow.isFullScreen());
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: 'Actual Size',
                    accelerator: 'CmdOrCtrl+0',
                    click: () => {
                        if (mainWindow) {
                            mainWindow.webContents.setZoomLevel(0);
                        }
                    }
                },
                {
                    label: 'Zoom In',
                    accelerator: 'CmdOrCtrl+Plus',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom + 0.5);
                        }
                    }
                },
                {
                    label: 'Zoom Out',
                    accelerator: 'CmdOrCtrl+-',
                    click: () => {
                        if (mainWindow) {
                            const currentZoom = mainWindow.webContents.getZoomLevel();
                            mainWindow.webContents.setZoomLevel(currentZoom - 0.5);
                        }
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'Visit Repository',
                    click: () => {
                        shell.openExternal('https://github.com/Saarthaksr7/Guacamole-rapper');
                    }
                },
                { type: 'separator' },
                {
                    label: 'About',
                    click: () => {
                        const aboutMessage = `Guacamole Wrapper v${app.getVersion()}\n\nElectron wrapper for Apache Guacamole\n\nCreated by Saarthaksr7`;
                        require('electron').dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'About Guacamole Wrapper',
                            message: aboutMessage,
                            buttons: ['OK']
                        });
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createSettingsWindow() {
    // Don't create multiple settings windows
    if (settingsWindow) {
        settingsWindow.focus();
        return;
    }

    settingsWindow = new BrowserWindow({
        width: 600,
        height: 500,
        resizable: false,
        minimizable: false,
        maximizable: false,
        parent: mainWindow,
        modal: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        icon: path.join(__dirname, 'icon.png'),
        title: 'Settings',
        autoHideMenuBar: true
    });

    settingsWindow.loadFile('settings.html');

    settingsWindow.on('closed', () => {
        settingsWindow = null;
    });
}

// IPC Handlers
ipcMain.handle('get-settings', () => {
    return {
        targetUrl: store.get('targetUrl'),
        hardwareAcceleration: store.get('hardwareAcceleration'),
        networkPriority: store.get('networkPriority')
    };
});

ipcMain.handle('save-settings', (event, settings) => {
    const oldHardwareAcceleration = store.get('hardwareAcceleration');
    const hardwareAccelerationChanged = oldHardwareAcceleration !== settings.hardwareAcceleration;

    // Save all settings
    store.set('targetUrl', settings.targetUrl);
    store.set('hardwareAcceleration', settings.hardwareAcceleration);
    store.set('networkPriority', settings.networkPriority);

    // Return whether a restart is needed
    return {
        success: true,
        restartRequired: hardwareAccelerationChanged
    };
});

ipcMain.handle('restart-app', () => {
    app.relaunch();
    app.exit(0);
});

ipcMain.handle('open-external', async (event, url) => {
    try {
        await shell.openExternal(url);
    } catch (error) {
        console.error('Failed to open external URL:', error);
        throw error;
    }
});

// App lifecycle
app.whenReady().then(() => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
