import { extendObservable } from 'mobx'

import standardConfig from '../src/standardConfig'

const app = {}
extendObservable(app, {
  fetchingDb: false,
  errorFetchingDb: null,
  db: null,
  showMessageModal: false,
  messageTextLine1: '',
  messageTextLine2: '',
  config: standardConfig,
  errors: [],
})

export default app
