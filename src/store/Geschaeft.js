import { types, getParent } from 'mobx-state-tree'
import moment from 'moment'

import isDateField from '../src/isDateField'
import convertDateToYyyyMmDd from '../src/convertDateToYyyyMmDd'

export default types
  .model('Geschaeft', {
    abteilung: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    aktennummer: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    aktenstandort: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    ausloeser: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    datumAusgangAwel: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    datumEingangAwel: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    details: types.maybe(types.union(types.string, types.integer, types.null)),
    entscheidAwel: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    entscheidBdv: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    entscheidBvv: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    entscheidKr: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    entscheidRrb: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    fristAbteilung: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    fristAmtschef: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    fristAwel: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    fristDirektion: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    fristMitarbeiter: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    gegenstand: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    geschaeftsart: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    idGeschaeft: types.integer,
    // there seem to exist '' values in idVorgeschaeft...
    idVorgeschaeft: types.maybe(
      types.union(types.integer, types.string, types.null),
    ),
    mutationsdatum: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    mutationsperson: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    naechsterSchritt: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    ort: types.maybe(types.union(types.string, types.integer, types.null)),
    parlVorstossStufe: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    parlVorstossTyp: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    parlVorstossZustaendigkeitAwel: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    rechtsmittelInstanz: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    rechtsmittelErledigung: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    rechtsmittelEntscheidNr: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    rechtsmittelEntscheidDatum: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    rechtsmittelTxt: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    status: types.maybe(types.union(types.string, types.integer, types.null)),
    verantwortlich: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    vermerk: types.maybe(types.union(types.string, types.integer, types.null)),
    vermerkIntern: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
    zustaendigeDirektion: types.maybe(
      types.union(types.string, types.integer, types.null),
    ),
  })
  .actions(self => ({
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
