import { types, getParent } from 'mobx-state-tree'
import Database from 'better-sqlite3'
import fs from 'fs'

import saveConfig from '../src/saveConfig'
import getConfig from '../src/getConfig'
import standardConfig from '../src/standardConfig'

export default types
  .model('Config', {
    dbPath: types.optional(
      types.union(types.string, types.integer, types.null),
      '',
    ),
    tableColumnWidth: types.optional(
      types.union(types.integer, types.null),
      700,
    ),
    geschaefteColumnWidth: types.optional(
      types.union(types.integer, types.null),
      400,
    ),
  })
  .actions(self => ({
    get() {
      const appStore = getParent(self, 1)

      const config = getConfig()
      console.log('Store, App, Config, get, config:', config)
      const newConfig = config || standardConfig
      self = newConfig
      const { dbPath } = newConfig
      const dbExists = fs.existsSync(dbPath)
      if (!dbPath || !dbExists) {
        return appStore.dbGetAtStandardpathIfPossible()
      }
      const db = new Database(dbPath, { fileMustExist: true })
      console.log('Store, App, Config, get, dbPath:', dbPath)
      appStore.dbChooseSuccess(dbPath, db)
    },
    setKey(key, value) {
      if (value) {
        self[key] = value
      } else if (self[key]) {
        delete self[key]
      }
      saveConfig(self)
    },
    configUiReset() {
      const newConfig = {}
      const dbPath = self.dbPath
      if (dbPath) {
        newConfig.dbPath = dbPath
      }
      saveConfig(newConfig)
      self = newConfig
    },
  }))
