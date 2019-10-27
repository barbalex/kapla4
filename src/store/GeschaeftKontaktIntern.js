import { types } from 'mobx-state-tree'

export default types.model('GeschaeftKontaktIntern', {
  idGeschaeft: types.maybeNull(types.number),
  idKontakt: types.maybeNull(types.number),
})
