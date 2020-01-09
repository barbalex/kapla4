import { types, getParent } from 'mobx-state-tree'
import Database from 'better-sqlite3'
import fs from 'fs'

import standardConfig from '../src/standardConfig'
import standardDbPath from '../src/standardDbPath'
import saveConfigModule from '../src/saveConfig'
import getConfig from '../src/getConfig'
import chooseDb from '../src/chooseDb'
import filterForFaelligeGeschaefte from '../src/filterForFaelligeGeschaefte'

export default types
  .model('App', {
    showMessageModal: types.optional(types.boolean, false),
    messageTextLine1: types.optional(types.string, ''),
    messageTextLine2: types.optional(types.string, ''),
    username: types.maybe(types.string),
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
  .volatile(() => ({
    db: null,
    lastWindowState: standardConfig.lastWindowState,
  }))
  .actions(self => {
    const store = getParent(self, 1)

    return {
      setDb(val) {
        self.db = val
      },
      setUsername(username) {
        self.username = username
      },
      saveConfig(val = {}) {
        saveConfigModule({
          dbPath: self.dbPath,
          tableColumnWidth: self.tableColumnWidth,
          geschaefteColumnWidth: self.geschaefteColumnWidth,
          lastWindowState: self.lastWindowState,
          ...val,
        })
      },
      setDbPath(val) {
        self.dbPath = val
      },
      setTableColumnWidth(val) {
        self.tableColumnWidth = val
      },
      setGeschaefteColumnWidth(val) {
        self.geschaefteColumnWidth = val
      },
      setLastWindowState(val) {
        self.lastWindowState = val
      },
      uiReset() {
        self.tableColumnWidth = standardConfig.tableColumnWidth
        self.geschaefteColumnWidth = standardConfig.geschaefteColumnWidth
      },
    }
  })
