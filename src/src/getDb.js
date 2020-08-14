import Database from 'better-sqlite3'

import chooseDb from './chooseDb'
import getConfig from './getConfig'
import standardDbPath from './standardDbPath'

export default async (store) => {
  const { addErrorMessage } = store
  const {
    setDbPath,
    setTableColumnWidth,
    setGeschaefteColumnWidth,
    setLastWindowState,
    saveConfig,
  } = store.app
  const config = getConfig()
  if (config.dbPath) setDbPath(config.dbPath)
  if (config.tableColumnWidth) setTableColumnWidth(config.tableColumnWidth)
  if (config.geschaefteColumnWidth)
    setGeschaefteColumnWidth(config.geschaefteColumnWidth)
  if (config.lastWindowState) setLastWindowState(config.lastWindowState)
  let dbPath = config.dbPath || standardDbPath

  let db
  try {
    db = new Database(dbPath, { fileMustExist: true })
  } catch (error) {
    if (
      (error.code && error.code === 'SQLITE_CANTOPEN') ||
      error.message.includes('directory does not exist')
    ) {
      // user needs to choose db file
      try {
        dbPath = await chooseDb()
      } catch (chooseError) {
        addErrorMessage(chooseError.message)
        return console.log('Error after choosing db:', chooseError)
      }
      setDbPath(dbPath)
      saveConfig({ dbPath })
      db = new Database(dbPath, { fileMustExist: true })
    } else {
      addErrorMessage(error.message)
      return console.log('index.js, Error opening db file:', error)
    }
  }
  return db
}
