import { types } from 'mobx-state-tree'

import GeschaeftKontaktIntern from './GeschaeftKontaktIntern'

export default types
  .model('GeschaefteKontakteIntern', {
    activeIdGeschaeft: types.maybeNull(types.number),
    activeIdKontakt: types.maybeNull(types.number),
    geschaefteKontakteIntern: types.array(GeschaeftKontaktIntern),
  })
  .volatile(() => ({
    error: [],
  }))
