import { types } from 'mobx-state-tree'

export default types.model('Page', {
  full: types.optional(types.boolean, false),
  geschaefte: types.array(types.integer),
})
