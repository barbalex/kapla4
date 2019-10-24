import { types } from 'mobx-state-tree'

const Gki = types.model('GKI', {
  idGeschaeft: types.maybeNull(types.number),
  idKontakt: types.maybeNull(types.number),
})

export default types
  .model('GeschaefteKontakteIntern', {
    fetching: types.optional(types.boolean, false),
    activeIdGeschaeft: types.maybeNull(types.number),
    activeIdKontakt: types.maybeNull(types.number),
    geschaefteKontakteIntern: types.array(Gki),
  })
  .volatile(() => ({
    error: [],
  }))
