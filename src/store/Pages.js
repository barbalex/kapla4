import { types, getParent, getSnapshot } from 'mobx-state-tree'

import Page from './Page'
import GeschaeftRemaining from './GeschaeftRemaining'
import pageStandardState from '../src/pageStandardState'

export default types
  .model('Pages', {
    pages: types.array(Page),
    activePageIndex: types.optional(types.number, 0),
    building: types.optional(types.boolean, false),
    title: types.optional(types.string, ''),
    queryTitle: types.optional(types.boolean, true),
    reportType: types.optional(types.string, 'fristen'),
    showPagesModal: types.optional(types.boolean, false),
    modalTextLine1: types.optional(types.string, ''),
    modalTextLine2: types.optional(types.string, ''),
    remainingGeschaefte: types.array(GeschaeftRemaining),
  })
  .volatile(() => ({
    //remainingGeschaefte: [],
  }))
  .actions(self => ({
    initiate(reportType) {
      const store = getParent(self, 1)
      self.cleanUp()
      const { geschaeftePlusFilteredAndSorted } = store.geschaefte
      self.reportType = reportType
      console.log(
        'Store, initiate, geschaeftePlusFilteredAndSorted:',
        geschaeftePlusFilteredAndSorted,
      )
      self.remainingGeschaefte = [...geschaeftePlusFilteredAndSorted]

      self.building = true
      console.log(
        'Store, initiate, remainingGeschaefte:',
        self.remainingGeschaefte,
      )
      store.history.push('/pages')
    },
    cleanUp() {
      self.pages = [{ ...pageStandardState }]
      self.activePageIndex = 0
      self.remainingGeschaefte = []
      self.building = false
      self.title = ''
      self.queryTitle = true
      self.reportType = 'fristen'
      self.showPagesModal = false
      self.modalTextLine1 = ''
      self.modalTextLine2 = ''
    },
    stop() {
      self.remainingGeschaefte = []
      self.building = false
      self.showPagesModal = false
      self.modalTextLine1 = ''
      self.modalTextLine2 = ''
    },
    showModal(showPagesModal, modalTextLine1, modalTextLine2) {
      self.showPagesModal = showPagesModal
      self.modalTextLine1 = modalTextLine1
      self.modalTextLine2 = modalTextLine2
    },
    finishedBuilding() {
      self.building = false
    },
    pagesQueryTitle(queryTitle) {
      self.queryTitle = queryTitle
    },
    setTitle(title) {
      self.title = title
    },
    newPage() {
      self.activePageIndex += 1
      self.pages.push({ ...pageStandardState })
    },
    addGeschaeft() {
      if (self.building) {
        const activePage = self.pages.find((p, i) => i === self.activePageIndex)
        if (activePage) {
          activePage.geschaefte.push(self.remainingGeschaefte.shift())
        }
      }
    },
    moveGeschaeftToNewPage() {
      // remove geschaeft from active page
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      if (activePage) {
        activePage.full = true
        self.remainingGeschaefte.unshift(activePage.geschaefte.pop())
        self.newPage()
        self.addGeschaeft()
      }
    },
  }))
