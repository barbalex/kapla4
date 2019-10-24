import { types } from 'mobx-state-tree'

export default types
  .model('GeschaefteKontakteIntern', {
    fetching: types.optional(types.boolean, false),
    activeIdGeschaeft: types.maybeNull(types.number),
    activeIdKontakt: types.maybeNull(types.number),
  })
  .volatile(() => ({
    error: [],
    geschaefteKontakteIntern: [],
  }))
