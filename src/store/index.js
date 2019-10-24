import { types } from 'mobx-state-tree'

import observablehistory from './observableHistory'
import App from './App'
import Geschaefte from './Geschaefte'

export default db =>
  types
    .model({
      app: App,
      dirty: types.optional(types.boolean, false),
      geschaefte: Geschaefte,
    })
    .volatile(() => ({
      history: observablehistory,
    }))
    .views(self => ({}))
    .actions(self => {})
