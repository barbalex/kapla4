import { types } from 'mobx-state-tree'

export default types.model('Config', {
  dbPath: types.optional(
    types.union(types.string, types.integer, types.null),
    '',
  ),
  tableColumnWidth: types.optional(types.union(types.integer, types.null), 700),
  geschaefteColumnWidth: types.optional(
    types.union(types.integer, types.null),
    400,
  ),
})
