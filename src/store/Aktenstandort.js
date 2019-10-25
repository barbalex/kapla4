import { types } from 'mobx-state-tree'

export default types.model('Aktenstandort', {
  id: types.maybeNull(types.integer),
  aktenstandort: types.maybeNull(types.string),
  historisch: types.maybeNull(types.integer),
  sort: types.maybeNull(types.integer),
})
