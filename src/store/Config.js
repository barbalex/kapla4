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
      standardConfig.dbPath,
    ),
    tableColumnWidth: types.optional(
      types.union(types.integer, types.null),
      standardConfig.tableColumnWidth,
    ),
    geschaefteColumnWidth: types.optional(
      types.union(types.integer, types.null),
      standardConfig.geschaefteColumnWidth,
    ),
  })
  .actions(self => ({
    setKey(key, value) {
      if (value) {
        self[key] = value
      } else if (self[key]) {
        delete self[key]
      }
      saveConfig(self)
    },
    uiReset() {
      const newConfig = {...self}
      delete newConfig.tableColumnWidth
      delete newConfig.geschaefteColumnWidth
      saveConfig(newConfig)
      self = newConfig
    },
  }))
