import { types } from 'mobx-state-tree'

import observablehistory from './observableHistory'
import App from './App'

export default db =>
  types
    .model({
      app: App,
      dirty: types.optional(types.boolean, false),
    })
    .volatile(() => ({
      history: observablehistory,
    }))
    .views(self => ({}))
    .actions(self => {})
