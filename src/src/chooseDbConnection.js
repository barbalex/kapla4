import { remote } from 'electron'

import chooseDb from './chooseDb'
import getConfig from './getConfig'
import saveConfig from './saveConfig'

export default async () => {
  const config = getConfig()
  let dbPath
  try {
    dbPath = await chooseDb()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  config.dbPath = dbPath
  saveConfig(config)
  remote.getCurrentWindow().reload()
}
