import { types } from 'mobx-state-tree'

export default types.model('ParlVorstossTyp', {
  id: types.maybeNull(types.integer),
  parlVorstossTyp: types.maybeNull(types.string),
  historisch: types.maybeNull(types.integer),
  sort: types.maybeNull(types.integer),
})
