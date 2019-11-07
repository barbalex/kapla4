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
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { app, addError, setLocation } = store
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
        if (activeLocation !== 'table') {
          setLocation(['table'])
        }
      },
      reset() {
        Object.keys(tableStandardState).forEach(k => {
          self[k] = tableStandardState[k]
        })
      },
      toggleActivatedRow(id) {
        self.id = self.id && self.id === id ? null : id
      },
      changeState(id, field, value) {
        const row = self.rows[self.table].find(r => r.id === id)
        if (row) {
          row[field] = value
        }
      },
      updateInDb(id, field, value) {
        const { app, addError } = store
        // no need to do something on then
        // ui was updated on TABLE_CHANGE_STATE
        try {
          app.db
            .prepare(
              `
            UPDATE
              ${self.table}
            SET
              ${field} = '${value}'
            WHERE
              id = ${id}`,
            )
            .run()
        } catch (error) {
          // TODO: reset ui
          console.log('Store, updateInDb, error:', error.message)
          return addError(error)
        }
        self.changeState(id, field, value)
        // need to reload this table in self
        const actionName = `${self.table}OptionsGet`
        store[actionName]()
      },
    }
  })
