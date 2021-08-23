const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const fs = require('fs-extra')
const path = require('path')

const getConfig = () => {
  const userPath = app.getPath('userData')
  const dataFilePath = path.join(userPath, 'kaplaConfig.json')
  if (!fs.existsSync(dataFilePath)) return {}
  const configFile = fs.readFileSync(dataFilePath, 'utf-8') || {}
  if (!configFile) return {}
  return JSON.parse(configFile)
}

const saveConfig = (data) => {
  const userPath = app.getPath('userData')
  const dataFilePath = path.join(userPath, 'kaplaConfig.json')
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
  return null
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const browserWindowOptions = {
  width: 1800,
  height: 1024,
  icon: path.join(__dirname, 'src/etc/app.ico'),
  // only show after it was sized
  show: false,
  webPreferences: {
    nodeIntegration: true,
    // this should be respected but warning remains in console
    // see: https://github.com/electron/electron/issues/24950
    worldSafeExecuteJavaScript: true,
    // this needs to be explicitly set in electron v10
    // see: https://github.com/electron/electron/issues/21408
    enableRemoteModule: true,
  },
}

// get last window state
// and set it again
const { lastWindowState } = getConfig()
if (lastWindowState) {
  if (lastWindowState.width) browserWindowOptions.width = lastWindowState.width
  if (lastWindowState.height) {
    browserWindowOptions.height = lastWindowState.height
  }
  if (lastWindowState.x) browserWindowOptions.x = lastWindowState.x
  if (lastWindowState.y) browserWindowOptions.y = lastWindowState.y
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow(browserWindowOptions)
  if (lastWindowState && lastWindowState.maximized) {
    mainWindow.maximize()
  }
  Menu.setApplicationMenu(null)
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.show()

  // Open the DevTools
  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // save window state on close
  mainWindow.on('close', (e) => {
    e.preventDefault()

    const bounds = mainWindow.getBounds()
    const config = getConfig()
    config.lastWindowState = {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      maximized: mainWindow.isMaximized(),
    }
    saveConfig(config)

    // in case user has changed data inside an input and not blured yet,
    // force bluring so data is saved
    mainWindow.webContents.executeJavaScript('document.activeElement.blur()')
    setTimeout(() => mainWindow.destroy(), 500)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// exceljs workbook.xlsx.writeFile does not work
// so export in main thread
ipcMain.on('SAVE_FILE', (event, path, data) => {
  fs.outputFile(path, data)
    .then(() => event.sender.send('SAVED_FILE'))
    .catch((error) => event.sender.send('ERROR', error.message))
})

ipcMain.handle('get-config', () => getConfig())

ipcMain.handle('save-config', (event, data) => saveConfig(data))

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
