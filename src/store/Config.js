import { types, getParent } from 'mobx-state-tree'
import betterSqlite from 'better-sqlite3'
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

      getConfig()
        .then(config => {
          const newConfig = config || standardConfig
          self = newConfig
          const { dbPath } = newConfig
          if (!dbPath) {
            return appStore.dbGetAtStandardpathIfPossible()
          }
          const dbExists = fs.existsSync(dbPath)
          if (!dbExists) {
            return appStore.dbGetAtStandardpathIfPossible()
          }
          const db = betterSqlite(dbPath, { fileMustExist: true })
          appStore.dbChooseSuccess(dbPath, db)
        })
        .catch(error => console.error(error))
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
