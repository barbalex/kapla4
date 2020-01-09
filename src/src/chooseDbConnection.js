import { remote } from 'electron'

import chooseDb from './chooseDb'
import getConfig from './getConfig'
import saveConfig from './saveConfig'

export default async (store) => {
  const {setDbPath, saveConfig} = store.app
  const config = getConfig()

  let dbPath
  try {
    dbPath = await chooseDb()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  setDbPath(dbPath)
  setTimeout(() => {
    saveConfig({ dbPath })
    setTimeout(()=> remote.getCurrentWindow().reload())
  })
}
