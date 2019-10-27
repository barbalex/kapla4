import { types } from 'mobx-state-tree'

export default types.model('RechtsmittelInstanz', {
  id: types.maybeNull(types.integer),
  rechtsmittelInstanz: types.maybeNull(types.string),
  historisch: types.maybeNull(types.integer),
  sort: types.maybeNull(types.integer),
})
