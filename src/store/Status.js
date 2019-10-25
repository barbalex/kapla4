import { types } from 'mobx-state-tree'

export default types.model('Status', {
  id: types.maybeNull(types.integer),
  status: types.maybeNull(types.string),
  geschaeftKannFaelligSein: types.maybeNull(types.integer),
  historisch: types.maybeNull(types.integer),
  sort: types.maybeNull(types.integer),
})
