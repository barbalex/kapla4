/* eslint-disable no-param-reassign */
import { action } from 'mobx'
import _ from 'lodash'

import pageStandardState from '../../src/pageStandardState'

export default store => ({
  pagesCleanUp: action(() => {
    store.pages.pages = [Object.assign(pageStandardState)]
    store.pages.activePageIndex = 0
    store.pages.remainingGeschaefte = []
    store.pages.building = false
    store.pages.title = ''
    store.pages.queryTitle = true
    store.pages.reportType = 'fristen'
    store.pages.showPagesModal = false
    store.pages.modalTextLine1 = ''
    store.pages.modalTextLine2 = ''
  }),
  pagesStop: action(() => {
    store.pages.remainingGeschaefte = []
    store.pages.building = false
    store.pages.showPagesModal = false
    store.pages.modalTextLine1 = ''
    store.pages.modalTextLine2 = ''
  }),
  pagesModalShow: action((showPagesModal, modalTextLine1, modalTextLine2) => {
    store.pages.showPagesModal = showPagesModal
    store.pages.modalTextLine1 = modalTextLine1
    store.pages.modalTextLine2 = modalTextLine2
  }),
  pagesInitiate: action(reportType => {
    store.pagesCleanUp()
    const { geschaeftePlusFilteredAndSorted } = store.geschaefte
    store.pages.reportType = reportType
    store.pages.remainingGeschaefte = _.clone(geschaeftePlusFilteredAndSorted)
    store.pages.building = true
    store.history.push('/pages')
  }),
  pagesFinishedBuilding: action(() => {
    store.pages.building = false
  }),
  pagesQueryTitle: action(queryTitle => {
    store.pages.queryTitle = queryTitle
  }),
  pagesSetTitle: action(title => {
    store.pages.title = title
  }),
  pagesNewPage: action(() => {
    store.pages.activePageIndex += 1
    store.pages.pages.push(Object.assign(pageStandardState))
  }),
  pageAddGeschaeft: action(() => {
    if (store.pages.building) {
      const activePage = store.pages.pages.find((p, i) => i === store.pages.activePageIndex)
      if (activePage) {
        activePage.geschaefte.push(store.pages.remainingGeschaefte.shift())
      }
    }
  }),
  pagesMoveGeschaeftToNewPage: action(() => {
    // remove geschaeft from active page
    const { pages } = store
    const { activePageIndex } = pages
    const activePage = pages.pages.find((p, i) => i === activePageIndex)
    if (activePage) {
      activePage.full = true
      store.pages.remainingGeschaefte.unshift(activePage.geschaefte.pop())
      store.pagesNewPage()
      store.pageAddGeschaeft()
    }
  }),
})
