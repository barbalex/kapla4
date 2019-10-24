import { types } from 'mobx-state-tree'

export default types.model('User', {}).volatile(() => ({
  error: null,
  username: null,
}))
