// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/

const electron = require('electron')
const fs = require('fs')
const path = require('path')

const app = electron.app ? electron.app : electron.remote.app
const dataFilePath = path.join(app.getPath('userData'), 'kaplaConfig.json')

module.exports = () =>
  new Promise(resolve => {
    if (!fs.existsSync(dataFilePath)) return resolve(null)
    const configFile = fs.readFileSync(dataFilePath, 'utf-8')
    if (!configFile) return resolve(null)
    const config = JSON.parse(configFile)
    resolve(config)
  })
