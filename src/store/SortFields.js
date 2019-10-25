import { types } from 'mobx-state-tree'

export default types.model('SortFields', {
  field: types.maybe(types.union(types.string, types.integer, types.null)),
  direction: types.maybe(types.union(types.string, types.integer, types.null)),
})
