import { types } from 'mobx-state-tree'

export default types
  .model('Table', {
    id: types.maybeNull(types.number),
    table: types.maybeNull(types.string),
    fetching: types.optional(types.boolean, false),
  })
  .volatile(() => ({
    rows: [],
    // following: state for active row
    error: [],
  }))
