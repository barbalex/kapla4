import { types } from 'mobx-state-tree'

export default types.model('Interne', {
  id: types.maybeNull(types.integer),
  abteilung: types.maybe(types.union(types.string, types.integer, types.null)),
  buero: types.maybe(types.union(types.string, types.integer, types.null)),
  eMail: types.maybe(types.union(types.string, types.integer, types.null)),
  itKonto: types.maybe(types.union(types.string, types.integer, types.null)),
  kurzzeichen: types.maybe(
    types.union(types.string, types.integer, types.null),
  ),
  name: types.maybe(types.union(types.string, types.integer, types.null)),
  telefon: types.maybe(types.union(types.string, types.integer, types.null)),
  titel: types.maybe(types.union(types.string, types.integer, types.null)),
  vorname: types.maybe(types.union(types.string, types.integer, types.null)),
})
