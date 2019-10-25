import { types } from 'mobx-state-tree'

export default types.model('Abteilung', {
  id: types.maybeNull(types.integer),
  abteilung: types.maybeNull(types.string),
  historisch: types.maybeNull(types.integer),
  sort: types.maybeNull(types.integer),
})
