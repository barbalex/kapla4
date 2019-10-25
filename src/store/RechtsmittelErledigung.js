import { types } from 'mobx-state-tree'

export default types.model('RechtsmittelErledigung', {
  id: types.maybeNull(types.integer),
  rechtsmittelErledigung: types.maybeNull(types.string),
  historisch: types.maybeNull(types.integer),
  sort: types.maybeNull(types.integer),
})
