import { types, getParent } from 'mobx-state-tree'

import addComputedValuesToGeschaefte from '../src/addComputedValuesToGeschaefte'
import filterGeschaeftePlus from '../src/filterGeschaeftePlus'
import sortGeschaeftePlusFiltered from '../src/sortGeschaeftePlusFiltered'
import getHistoryOfGeschaeft from '../src/getHistoryOfGeschaeft'

export default types
  .model('Geschaefte', {
    fetching: types.optional(types.boolean, false),
    filterFulltext: types.optional(types.string, ''),
    filterType: types.maybeNull(types.string),
    activeId: types.maybeNull(types.number),
    willDelete: types.optional(types.boolean, false),
  })
  .volatile(() => ({
    error: [],
    geschaefte: [],
    links: [],
    geko: [],
    filterFields: [],
    sortFields: [],
    // dropdown lists
    abteilungOptions: [],
    rechtsmittelErledigungOptions: [],
    parlVorstossTypOptions: [],
    statusOptions: [],
    geschaeftsartOptions: [],
    aktenstandortOptions: [],
    interneOptions: [],
    externeOptions: [],
  }))
  .views(self => ({
    get geschaeftePlus() {
      const store = getParent(self, 1)
      return addComputedValuesToGeschaefte(store)
    },
    get geschaeftePlusFiltered() {
      const store = getParent(self, 1)
      return filterGeschaeftePlus(store)
    },
    get geschaeftePlusFilteredAndSorted() {
      const store = getParent(self, 1)
      return sortGeschaeftePlusFiltered(store)
    },
    get historyOfActiveId() {
      return getHistoryOfGeschaeft(self.geschaefte, self.activeId)
    },
    get gekoOfActiveId() {
      return self.geko.filter(g => g.idGeschaeft === self.activeId)
    },
  }))
  .actions(self => ({}))
