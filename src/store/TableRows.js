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
  .actions((self) => {
    const store = getParent(self, 2)

    return {
      setRows(table, rows) {
        self[table] = rows
      },
      delete(table, id) {
        const { app, addErrorMessage } = store
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
          return addErrorMessage(error.message)
        }
        store.table.toggleActivatedRow(id)
        self[table] = self[table].filter((g) => g.id !== id)
      },
      insert(table) {
        const location = store.location.toJSON()
        const activeLocation = location[0]
        const { addErrorMessage, setLocation } = store
        const { db } = store.app
        let result
        try {
          result = db.prepare(`INSERT INTO ${table} (id) VALUES (NULL)`).run()
        } catch (error) {
          return addErrorMessage(error.message)
        }
        const id = result.lastInsertRowid
        // return full dataset
        let row
        try {
          row = db.prepare(`SELECT * FROM ${table} WHERE id = ${id}`).get()
        } catch (error) {
          return addErrorMessage(error.message)
        }
        self[table].unshift(row)
        store.table.toggleActivatedRow(row.id)
        if (activeLocation !== 'table') {
          setLocation(['table'])
        }
      },
    }
  })
