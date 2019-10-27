import { types, getParent } from 'mobx-state-tree'

import tableStandardState from '../src/tableStandardState'
import TableRows from './TableRows'

export default types
  .model('Table', {
    fetching: types.optional(types.boolean, false),
    // following: state for active row
    id: types.maybeNull(types.number),
    table: types.maybeNull(types.string),
    rows: types.optional(TableRows, {}),
  })
  .volatile(() => ({
    error: [],
  }))
  .actions(self => {
    const store = getParent(self, 1)

    return {
      fetch(table) {
        const { app, addError, history } = store
        self.table = table
        let rows
        try {
          rows = app.db.prepare(`SELECT * FROM ${table}`).all()
        } catch (error) {
          return addError(error)
        }
        self.table = table
        self.rows.setRows(table, rows)
        self.id = null
        if (history.location.pathname !== '/table') {
          history.push('/table')
        }
      },
      reset() {
        Object.keys(tableStandardState).forEach(k => {
          self[k] = tableStandardState[k]
        })
      },
      rowToggleActivated(id) {
        self.id = self.id && self.id === id ? null : id
      },
      rowInsert(table) {
        const { addError, history } = store
        const { db } = store.app
        let result
        try {
          result = db.prepare(`INSERT INTO ${table} (id) VALUES (NULL)`).run()
        } catch (error) {
          return addError(error)
        }
        const id = result.lastInsertRowid
        // return full dataset
        let row
        try {
          row = db.prepare(`SELECT * FROM ${table} WHERE id = ${id}`).get()
        } catch (error) {
          return addError(error)
        }
        // react does not want to get null values
        Object.keys(row).forEach(key => {
          if (row[key] === null) {
            row[key] = ''
          }
        })
        self.rows[table].push(row)
        self.rowToggleActivated(table, row.id)
        if (history.location.pathname !== '/table') {
          history.push('/table')
        }
      },
      rowDelete(table, id) {
        const { app, addError } = store
        try {
          app.db
            .prepare(
              `
              DELETE FROM
                ${table}
              WHERE
                id = ${id}`,
            )
            .run()
        } catch (error) {
          return addError(error)
        }
        self.rowToggleActivated(table, null)
        self.rows.setRows(table, self.rows[table].filter(g => g.id !== id))
      },
      changeState(id, field, value) {
        const row = self.rows[self.table].find(r => r.id === id)
        console.log('Store, Table, changeState', {
          id,
          field,
          value,
          row,
          rows: self.rows[self.table],
        })
        if (row) {
          row[field] = value
        }
      },
      updateInDb(id, field, value) {
        const { app, addError } = store
        // no need to do something on then
        // ui was updated on TABLE_CHANGE_STATE
        try {
          app.db.prepare(
            `
            UPDATE
              ${self.table}
            SET
              ${field} = '${value}'
            WHERE
              id = ${id}`,
          )
        } catch (error) {
          // TODO: reset ui
          return addError(error)
        }
        // need to reload this table in self
        const actionName = `${self.table}OptionsGet`
        store[actionName]()
      },
    }
  })
