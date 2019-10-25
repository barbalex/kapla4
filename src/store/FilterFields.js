import { types } from 'mobx-state-tree'

export default types.model('FilterFields', {
  comparator: types.maybe(types.union(types.string, types.integer, types.null)),
  field: types.maybe(types.union(types.string, types.integer, types.null)),
  value: types.maybe(
    types.union(types.string, types.integer, types.boolean, types.null),
  ),
})
