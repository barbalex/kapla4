import { types } from 'mobx-state-tree'

export default types.model('Geschaeftsart', {
  id: types.maybeNull(types.integer),
  geschaeftsart: types.maybeNull(types.string),
  historisch: types.maybeNull(types.integer),
  sort: types.maybeNull(types.integer),
})
