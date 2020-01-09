import { types, getParent } from 'mobx-state-tree'
import Database from 'better-sqlite3'
import fs from 'fs'

import standardConfig from '../src/standardConfig'
import standardDbPath from '../src/standardDbPath'
import Config from './Config'
import chooseDb from '../src/chooseDb'
import filterForFaelligeGeschaefte from '../src/filterForFaelligeGeschaefte'

export default types
  .model('App', {
    showMessageModal: types.optional(types.boolean, false),
    messageTextLine1: types.optional(types.string, ''),
    messageTextLine2: types.optional(types.string, ''),
    config: types.optional(Config, standardConfig),
    username: types.maybe(types.string),
  })
  .volatile(() => ({
    db: null,
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
    }
  })
