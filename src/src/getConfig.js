// see: http://www.mylifeforthecode.com/saving-and-restoring-window-state-in-electron/
const electron = require('electron')
const fs = require('fs')
const path = require('path')

const app = electron.app ? electron.app : electron.remote.app
const dataFilePath = path.join(app.getPath('userData'), 'kaplaConfig.json')

module.exports = () => {
  if (!fs.existsSync(dataFilePath)) return {}
  const configFile = fs.readFileSync(dataFilePath, 'utf-8')
  if (!configFile) return {}
  return JSON.parse(configFile)
}
