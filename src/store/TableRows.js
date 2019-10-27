import { types, getParent } from 'mobx-state-tree'

import Interne from './Interne'
import Externe from './Externe'
import Aktenstandort from './Aktenstandort'
import Geschaeftsart from './Geschaeftsart'
import ParlVorstossTyp from './ParlVorstossTyp'
import RechtsmittelInstanz from './RechtsmittelInstanz'
import RechtsmittelErledigung from './RechtsmittelErledigung'
import Status from './Status'

export default types
  .model('TableRows', {
    interne: types.array(Interne),
    externe: types.array(Externe),
    aktenstandort: types.array(Aktenstandort),
    geschaeftsart: types.array(Geschaeftsart),
    parlVorstossTyp: types.array(ParlVorstossTyp),
    rechtsmittelInstanz: types.array(RechtsmittelInstanz),
    rechtsmittelErledigung: types.array(RechtsmittelErledigung),
    status: types.array(Status),
  })
  .actions(self => {
    const store = getParent(self, 2)

    return {
      setRows(table, rows) {
        self[table] = rows
      },
      delete(table, id) {
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
        store.table.toggleActivatedRow(id)
        self[table] = self[table].filter(g => g.id !== id)
      },
      insert(table) {
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
        self[table].unshift(row)
        store.table.toggleActivatedRow(row.id)
        if (history.location.pathname !== '/table') {
          history.push('/table')
        }
      },
    }
  })
