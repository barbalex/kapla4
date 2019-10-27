import { types } from 'mobx-state-tree'

export default types.model('GeschaeftKontaktExtern', {
  idGeschaeft: types.maybeNull(types.number),
  idKontakt: types.maybeNull(types.number),
})
