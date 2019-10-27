import { types } from 'mobx-state-tree'

import GeschaeftRemaining from './GeschaeftRemaining'

export default types.model('Page', {
  full: types.optional(types.boolean, false),
  geschaefte: types.array(GeschaeftRemaining),
})
