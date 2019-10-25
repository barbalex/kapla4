import { types, getParent } from 'mobx-state-tree'

import addComputedValuesToGeschaefte from '../src/addComputedValuesToGeschaefte'
import filterGeschaeftePlus from '../src/filterGeschaeftePlus'
import sortGeschaeftePlusFiltered from '../src/sortGeschaeftePlusFiltered'
import getHistoryOfGeschaeft from '../src/getHistoryOfGeschaeft'
import Geschaeft from './Geschaeft'
import Links from './Links'
import Geko from './Geko'
import AbteilungOptions from './Abteilung'
import RechtsmittelErledigungOptions from './RechtsmittelErledigung'
import ParlVorstossTypOptions from './ParlVorstossTyp'
import StatusOptions from './Status'
import GeschaeftsartOptions from './Geschaeftsart'

export default types
  .model('Geschaefte', {
    fetching: types.optional(types.boolean, false),
    filterFulltext: types.optional(types.string, ''),
    filterType: types.maybeNull(types.string),
    activeId: types.maybeNull(types.number),
    willDelete: types.optional(types.boolean, false),
    geko: types.array(Geko),
    geschaefte: types.array(Geschaeft),
    links: types.array(Links),
    abteilungOptions: types.array(AbteilungOptions),
    rechtsmittelErledigungOptions: types.array(RechtsmittelErledigungOptions),
    parlVorstossTypOptions: types.array(ParlVorstossTypOptions),
    statusOptions: types.array(StatusOptions),
    geschaeftsartOptions: types.array(GeschaeftsartOptions),
  })
  .volatile(() => ({
    error: [],
    filterFields: [],
    sortFields: [],
    // dropdown lists
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
