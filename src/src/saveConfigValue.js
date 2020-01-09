// this module will be called from main or inside app
// so get app from electron or from electron.remote

const getConfig = require('./getConfig.js')
const saveConfig = require('./saveConfig.js')

module.exports = (key, value) => {
  const config = getConfig()
  config[key] = value
  saveConfig(config)
}
