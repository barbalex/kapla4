import { types } from 'mobx-state-tree'

export default types.model('Links', {
  idGeschaeft: types.maybeNull(types.integer),
  url: types.maybeNull(types.string),
  txt: types.maybeNull(types.string),
})
