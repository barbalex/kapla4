import { types } from 'mobx-state-tree'

import GeschaeftKontaktIntern from './GeschaeftKontaktIntern'

export default types
  .model('GeschaefteKontakteIntern', {
    fetching: types.optional(types.boolean, false),
    activeIdGeschaeft: types.maybeNull(types.number),
    activeIdKontakt: types.maybeNull(types.number),
    geschaefteKontakteIntern: types.array(GeschaeftKontaktIntern),
  })
  .volatile(() => ({
    error: [],
  }))
