import { types } from 'mobx-state-tree'

import Page from './Page'
import Geschaeft from './Geschaeft'

export default types.model('Pages', {
  pages: types.array(Page),
  activePageIndex: types.optional(types.number, 0),
  building: types.optional(types.boolean, false),
  title: types.optional(types.string, ''),
  queryTitle: types.optional(types.boolean, true),
  reportType: types.optional(types.string, 'fristen'),
  showPagesModal: types.optional(types.boolean, false),
  modalTextLine1: types.optional(types.string, ''),
  modalTextLine2: types.optional(types.string, ''),
  remainingGeschaefte: types.array(Geschaeft),
})
