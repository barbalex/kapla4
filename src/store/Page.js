import { types } from 'mobx-state-tree'

export default types.model('Page', {}).volatile(() => ({
  geschaefte: [],
  full: false,
}))
