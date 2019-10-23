import { types } from 'mobx-state-tree'

import standardConfig from '../src/standardConfig'

export default types
  .model('App', {
    fetchingDb: types.optional(types.boolean, false),
    showMessageModal: types.optional(types.boolean, false),
    messageTextLine1: types.optional(types.string, ''),
    messageTextLine2: types.optional(types.string, ''),
  })
  .volatile(() => ({
    errorFetchingDb: null,
    db: null,
    config: standardConfig,
    errors: [],
  }))
