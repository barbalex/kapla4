import { types, getParent } from 'mobx-state-tree'
import betterSqlite from 'better-sqlite3'
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
    fetchingDb: types.optional(types.boolean, false),
    errorFetchingDb: types.maybeNull(types.string),
    showMessageModal: types.optional(types.boolean, false),
    messageTextLine1: types.optional(types.string, ''),
    messageTextLine2: types.optional(types.string, ''),
    config: types.optional(Config, standardConfig),
    user: types.optional(User, {}),
  })
  .volatile(() => ({
    db: null,
    errors: [],
  }))
  .actions(self => {
    const store = getParent(self, 1)

    return {
      dbGet() {
        self.fetchingDb = true
        self.errorFetchingDb = null
        chooseDb()
          .then(dbPath => {
            const db = betterSqlite(dbPath, { fileMustExist: true })
            self.dbChooseSuccess(dbPath, db)
            self.config.configSetKey('dbPath', dbPath)
          })
          .catch(err => self.dbChooseError(err))
      },
      dbChooseError(err) {
        self.fetchingDb = false
        self.errorFetchingDb = err.message
        self.db = null
      },
      dbChooseSuccess(dbPath, db) {
        self.fetchingDb = false
        self.db = db
        self.config = Object.assign({}, self.config, { dbPath })
        // get data
        store.faelligeStatiOptionsGet()
        store.geschaefte.fetchGeko()
        store.geschaefte.fetchLinks()
        store.interneOptionsGet()
        store.externeOptionsGet()
        store.getGeschaefteKontakteIntern()
        store.getGeschaefteKontakteExtern()
        store.rechtsmittelErledigungOptionsGet()
        store.parlVorstossTypOptionsGet()
        store.statusOptionsGet()
        store.geschaeftsartOptionsGet()
        store.aktenstandortOptionsGet()
        store.rechtsmittelInstanzOptionsGet()
        store.abteilungOptionsGet()
        store.geschaefte.fetch()
        self.fetchUsername()
        // set filter to fällige
        store.geschaefte.filterByFields(filterForFaelligeGeschaefte, 'fällige')
        store.geschaefte.sortByFields('fristMitarbeiter', 'DESCENDING')
      },
      dbGetAtStandardpathIfPossible() {
        // try to open db at standard path
        // need function that tests if db exists at standard path
        const standardDbExists = fs.existsSync(standardDbPath)
        if (standardDbExists) {
          const db = betterSqlite(standardDbPath, { fileMustExist: true })
          self.dbChooseSuccess(standardDbPath, db)
          self.config.configSetKey('dbPath', standardDbPath)
        } else {
          // let user choose db file
          self.fetchingDb = true
          self.errorFetchingDb = null
          chooseDb()
            .then(dbPath => {
              const db = betterSqlite(dbPath, { fileMustExist: true })
              self.dbChooseSuccess(dbPath, db)
              self.config.configSetKey('dbPath', dbPath)
            })
            .catch(err => self.dbChooseError(err))
        }
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
