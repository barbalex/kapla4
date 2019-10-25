import { types } from 'mobx-state-tree'

import Geschaeft from './Geschaeft'

export default types.model('Page', {
  full: types.optional(types.boolean, false),
  geschaefte: types.array(Geschaeft),
})
