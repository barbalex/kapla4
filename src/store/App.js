import { types } from 'mobx-state-tree'

import standardConfig from '../src/standardConfig'
import Config from './Config'

export default types
  .model('App', {
    fetchingDb: types.optional(types.boolean, false),
    showMessageModal: types.optional(types.boolean, false),
    messageTextLine1: types.optional(types.string, ''),
    messageTextLine2: types.optional(types.string, ''),
    config: types.optional(Config, standardConfig),
  })
  .volatile(() => ({
    errorFetchingDb: null,
    db: null,
    errors: [],
  }))
