/* eslint-disable no-param-reassign */
import { action } from 'mobx'

import tableStandardState from '../../src/tableStandardState'

export default store => ({
  tableReset: action(() => {
    Object.keys(tableStandardState).forEach(k => {
      store.table[k] = tableStandardState[k]
    })
  }),
  getTable: action(table => {
    const { app } = store
    store.table.table = table
    let rows
    try {
      rows = app.db.prepare(`SELECT * FROM ${table}`).all()
    } catch (error) {
      return store.addError(error)
    }
    store.table.table = table
    store.table.rows = rows
    store.table.id = null
    if (store.history.location.pathname !== '/table') {
      store.history.push('/table')
    }
  }),
  /*
   * ROW
   */
  tableRowToggleActivated: action((table, id) => {
    store.table.id = store.table.id && store.table.id === id ? null : id
  }),
  tableRowNewCreate: action(table => {
    const { db } = store.app
    let result
    try {
      result = db.prepare(`INSERT INTO ${table} (id) VALUES (NULL)`).run()
    } catch (error) {
      return store.addError(error)
    }
    const id = result.lastInsertRowid
    // return full dataset
    let row
    try {
      row = db.prepare(`SELECT * FROM ${table} WHERE id = ${id}`).get()
    } catch (error) {
      return store.addError(error)
    }
    // react does not want to get null values
    Object.keys(row).forEach(key => {
      if (row[key] === null) {
        row[key] = ''
      }
    })
    store.table.rows.push(row)
    store.tableRowToggleActivated(table, row.id)
    if (store.history.location.pathname !== '/table') {
      store.history.push('/table')
    }
  }),
  tableRowRemove: action((table, id) => {
    try {
      store.app.db
        .prepare(
          `
          DELETE FROM
            ${table}
          WHERE
            id = ${id}`,
        )
        .run()
    } catch (error) {
      return store.addError(error)
    }
    store.tableRowToggleActivated(table, null)
    store.table.rows = store.table.rows.filter(g => g.id !== id)
  }),
  tableChangeState: action((id, field, value) => {
    const row = store.table.rows.find(r => r.id === id)
    if (row) {
      row[field] = value
    }
  }),
  changeTableInDb: action((table, id, field, value) => {
    // no need to do something on then
    // ui was updated on TABLE_CHANGE_STATE
    try {
      store.app.db.prepare(
        `
        UPDATE
          ${table}
        SET
          ${field} = '${value}'
        WHERE
          id = ${id}`,
      )
    } catch (error) {
      // TODO: reset ui
      return store.addError(error)
    }
    // need to reload this table in store
    const actionName = `${table}OptionsGet`
    store[actionName]()
  }),
})
