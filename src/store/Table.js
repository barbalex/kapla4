import { types } from 'mobx-state-tree'

export default types.model('Table', {}).volatile(() => ({
  table: null,
  rows: [],
  fetching: false,
  // following: state for active row
  id: null,
  willDelete: false,
  error: [],
}))
