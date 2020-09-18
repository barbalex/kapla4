import { types, getParent } from 'mobx-state-tree'
import moment from 'moment'

import isDateField from '../src/isDateField'
import convertDateToYyyyMmDd from '../src/convertDateToYyyyMmDd'
import convertDateToDdMmYyyy from '../src/convertDateToDdMmYyyy'

export default types
  .model('Geschaeft', {
    abteilung: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    aktennummer: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    aktenstandort: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    ausloeser: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    datumAusgangAwel: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    datumEingangAwel: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    details: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    entscheidAwel: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    entscheidBdv: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    entscheidBvv: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    entscheidKr: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    entscheidRrb: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    fristAbteilung: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    fristAmtschef: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    fristAwel: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    fristDirektion: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    fristMitarbeiter: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    gegenstand: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    geschaeftsart: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    // need maybe when bericht can have no data
    idGeschaeft: types.maybe(types.integer),
    // there seem to exist '' values in idVorgeschaeft...
    idVorgeschaeft: types.maybe(
      types.union(types.integer, types.string, types.null, types.undefined),
    ),
    mutationsdatum: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    mutationsperson: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    naechsterSchritt: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    ort: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    parlVorstossStufe: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    parlVorstossTyp: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    parlVorstossZustaendigkeitAwel: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    rechtsmittelInstanz: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    rechtsmittelErledigung: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    rechtsmittelEntscheidNr: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    rechtsmittelEntscheidDatum: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    rechtsmittelTxt: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    status: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    verantwortlich: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    vermerk: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    vermerkIntern: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
    zustaendigeDirektion: types.maybe(
      types.union(types.string, types.integer, types.null, types.undefined),
    ),
  })
  .actions((self) => ({
    fetch() {
      // ensure data is always fresh
      const store = getParent(self, 3)
      const { app, addErrorMessage } = store
      let geschaeft
      try {
        geschaeft = app.db
          .prepare(`SELECT * FROM geschaefte where idGeschaeft = ?`)
          .get(self.idGeschaeft)
      } catch (error) {
        console.log('error:', error)
        return addErrorMessage(error.message)
      }
      Object.keys(geschaeft).forEach((field) => {
        if (isDateField(field)) {
          // convert date fields from YYYY-MM-DD to DD.MM.YYYY
          self[field] = convertDateToDdMmYyyy(geschaeft[field])
        } else {
          self[field] = geschaeft[field]
        }
      })
    },
    setValue({ field, value }) {
      const store = getParent(self, 3)
      const { app, addErrorMessage } = store
      const { username } = app
      // update mst
      self[field] = value
      self.mutationsperson = username
      self.mutationsdatum = moment().format('YYYY-MM-DD HH:mm:ss')
      /**
       * if field is date field
       * convert DD.MM.YYYY to YYYY-MM-DD
       */
      let value2 = value
      if (isDateField(field)) {
        value2 = convertDateToYyyyMmDd(value)
      }
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      try {
        app.db
          .prepare(
            `
              UPDATE
                geschaefte
              SET
                ${field} = ${value === null ? null : `'${value2}'`},
                mutationsdatum = '${now}',
                mutationsperson = '${username}'
              WHERE
                idGeschaeft = ${self.idGeschaeft}`,
          )
          .run()
      } catch (error) {
        addErrorMessage(error.message)
      }
    },
  }))
