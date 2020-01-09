import { types, getParent } from 'mobx-state-tree'
import Database from 'better-sqlite3'
import fs from 'fs'
import getMyName from 'username'

import standardConfig from '../src/standardConfig'
import standardDbPath from '../src/standardDbPath'
import Config from './Config'
import chooseDb from '../src/chooseDb'
import filterForFaelligeGeschaefte from '../src/filterForFaelligeGeschaefte'
import User from './User'

export default types
  .model('App', {
    errorFetchingDb: types.maybeNull(types.string),
    showMessageModal: types.optional(types.boolean, false),
    messageTextLine1: types.optional(types.string, ''),
    messageTextLine2: types.optional(types.string, ''),
    config: types.optional(Config, standardConfig),
    user: types.optional(User, {}),
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
      setUser(user) {
        self.user = user
      },
      fetchUsername() {
        const { user } = self
        if (!user.username) {
          const username = getMyName.sync()
          if (username) {
            user.error = null
            user.username = username
          } else {
            user.error = 'keinen Benutzernamen erhalten'
            user.username = ''
          }
        }
      },
    }
  })
