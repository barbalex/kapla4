import { types } from 'mobx-state-tree'

export default types
  .model('User', {
    username: types.maybe(types.string),
  })
  .volatile(() => ({
    error: null,
  }))
