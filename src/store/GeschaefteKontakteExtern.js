import { types } from 'mobx-state-tree'

import GeschaeftKontaktExtern from './GeschaeftKontaktExtern'

export default types
  .model('GeschaefteKontakteExtern', {
    fetching: types.optional(types.boolean, false),
    activeIdGeschaeft: types.maybeNull(types.number),
    activeIdKontakt: types.maybeNull(types.number),
    geschaefteKontakteExtern: types.array(GeschaeftKontaktExtern),
  })
  .volatile(() => ({
    error: [],
  }))
