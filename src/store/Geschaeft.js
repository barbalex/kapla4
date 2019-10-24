import { types } from 'mobx-state-tree'

export default types
  .model('Geschaeft', {})
  .volatile(() => ({
    abteilung: types.maybe(types.union(types.string, types.integer)),
    aktennummer: types.maybe(types.union(types.string, types.integer)),
    aktenstandort: types.maybe(types.union(types.string, types.integer)),
    ausloeser: types.maybe(types.union(types.string, types.integer)),
    datumAusgangAwel: types.maybe(types.union(types.string, types.integer)),
    datumEingangAwel: types.maybe(types.union(types.string, types.integer)),
    details: types.maybe(types.union(types.string, types.integer)),
    entscheidAwel: types.maybe(types.union(types.string, types.integer)),
    entscheidBdv: types.maybe(types.union(types.string, types.integer)),
    entscheidBvv: types.maybe(types.union(types.string, types.integer)),
    entscheidKr: types.maybe(types.union(types.string, types.integer)),
    entscheidRrb: types.maybe(types.union(types.string, types.integer)),
    fristAbteilung: types.maybe(types.union(types.string, types.integer)),
    fristAmtschef: types.maybe(types.union(types.string, types.integer)),
    fristAwel: types.maybe(types.union(types.string, types.integer)),
    fristDirektion: types.maybe(types.union(types.string, types.integer)),
    fristMitarbeiter: types.maybe(types.union(types.string, types.integer)),
    gegenstand: types.maybe(types.union(types.string, types.integer)),
    geschaeftsart: types.maybe(types.union(types.string, types.integer)),
    idGeschaeft: types.integer,
    idVorgeschaeft: types.maybe(types.integer),
    mutationsdatum: types.maybe(types.union(types.string, types.integer)),
    mutationsperson: types.maybe(types.union(types.string, types.integer)),
    naechsterSchritt: types.maybe(types.union(types.string, types.integer)),
    ort: types.maybe(types.union(types.string, types.integer)),
    parlVorstossStufe: types.maybe(types.union(types.string, types.integer)),
    parlVorstossTyp: types.maybe(types.union(types.string, types.integer)),
    parlVorstossZustaendigkeitAwel: types.maybe(
      types.union(types.string, types.integer),
    ),
    rechtsmittelInstanz: types.maybe(types.union(types.string, types.integer)),
    rechtsmittelErledigung: types.maybe(
      types.union(types.string, types.integer),
    ),
    rechtsmittelEntscheidNr: types.maybe(
      types.union(types.string, types.integer),
    ),
    rechtsmittelEntscheidDatum: types.maybe(
      types.union(types.string, types.integer),
    ),
    rechtsmittelTxt: types.maybe(types.union(types.string, types.integer)),
    status: types.maybe(types.union(types.string, types.integer)),
    verantwortlich: types.maybe(types.union(types.string, types.integer)),
    vermerk: types.maybe(types.union(types.string, types.integer)),
    vermerkIntern: types.maybe(types.union(types.string, types.integer)),
    zustaendigeDirektion: types.maybe(types.union(types.string, types.integer)),
  }))
  .views(self => ({}))
  .actions(self => ({}))
