import { types } from 'mobx-state-tree'

export default types.model('Links', {
  idGeschaeft: types.maybeNull(types.number),
  url: types.maybeNull(types.string),
  txt: types.optional(types.string, ''),
})
