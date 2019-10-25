import { types } from 'mobx-state-tree'

export default types.model('Externe', {
  id: types.maybeNull(types.integer),
  eMail: types.maybe(types.union(types.string, types.integer, types.null)),
  firma: types.maybe(types.union(types.string, types.integer, types.null)),
  name: types.maybe(types.union(types.string, types.integer, types.null)),
  telefon: types.maybe(types.union(types.string, types.integer, types.null)),
  titel: types.maybe(types.union(types.string, types.integer, types.null)),
  vorname: types.maybe(types.union(types.string, types.integer, types.null)),
})
