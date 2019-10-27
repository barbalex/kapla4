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

      console.log('Store, App, configGet, 0')
      getConfig()
        .then(config => {
          console.log('Store, App, configGet, 1, config:', config)
          const newConfig = config || standardConfig
          console.log('Store, App, configGet, 2, newConfig:', newConfig)
          self = newConfig
          console.log('Store, App, configGet, 3')
          const { dbPath } = newConfig
          console.log('Store, App, configGet, 4')
          if (!dbPath) {
            return appStore.dbGetAtStandardpathIfPossible()
          }
          console.log('Store, App, configGet, 5')
          const dbExists = fs.existsSync(dbPath)
          if (!dbExists) {
            return appStore.dbGetAtStandardpathIfPossible()
          }
          console.log('Store, App, configGet, 6')
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
