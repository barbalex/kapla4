import { types } from 'mobx-state-tree'

export default types.model('Geko', {
  idGeschaeft: types.number,
  gekoNr: types.maybeNull(types.string),
})
