import pageStandardState from './pageStandardState'

export default {
  pages: [Object.assign(pageStandardState)],
  activePageIndex: 0,
  remainingGeschaefte: [],
  building: false,
  title: '',
  queryTitle: true,
  reportType: 'fristen',
  showPagesModal: false,
  modalTextLine1: '',
  modalTextLine2: '',
}
