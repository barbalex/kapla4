import { remote } from 'electron'

import chooseDb from './chooseDb'

const chooseDbConnection = async (store) => {
  const { setDbPath, saveConfig } = store.app

  let dbPath
  try {
    dbPath = await chooseDb()
  } catch (chooseError) {
    return console.log('Error after choosing db:', chooseError)
  }
  setDbPath(dbPath)
  setTimeout(() => {
    saveConfig({ dbPath })
    setTimeout(() => remote.getCurrentWindow().reload())
  })
}

export default chooseDbConnection
