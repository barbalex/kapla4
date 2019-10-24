import { types } from 'mobx-state-tree'

import Page from './Page'

export default types
  .model('Pages', {
    pages: types.array(Page),
  })
  .volatile(() => ({
    activePageIndex: 0,
    remainingGeschaefte: [],
    building: false,
    title: '',
    queryTitle: true,
    reportType: 'fristen',
    showPagesModal: false,
    modalTextLine1: '',
    modalTextLine2: '',
  }))
