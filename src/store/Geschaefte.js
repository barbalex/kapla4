import { types, getParent } from 'mobx-state-tree'

import addComputedValuesToGeschaefte from '../src/addComputedValuesToGeschaefte'
import filterGeschaeftePlus from '../src/filterGeschaeftePlus'
import sortGeschaeftePlusFiltered from '../src/sortGeschaeftePlusFiltered'
import getHistoryOfGeschaeft from '../src/getHistoryOfGeschaeft'
import Geschaeft from './Geschaeft'
import Links from './Links'
import Geko from './Geko'
// seems these are not used
//import AbteilungOptions from './Abteilung'
//import RechtsmittelErledigungOptions from './RechtsmittelErledigung'
//import ParlVorstossTypOptions from './ParlVorstossTyp'
//import StatusOptions from './Status'
//import AktenstandortOptions from './Aktenstandort'
import InterneOptions from './Interne'
import ExterneOptions from './Externe'
import FilterFields from './FilterFields'
import SortFields from './SortFields'
import isDateField from '../src/isDateField'
import convertDateToDdMmYyyy from '../src/convertDateToDdMmYyyy'

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
    abteilungOptions: types.array(types.union(types.string, types.null)),
    rechtsmittelErledigungOptions: types.array(
      types.union(types.string, types.null),
    ),
    parlVorstossTypOptions: types.array(types.union(types.string, types.null)),
    statusOptions: types.array(types.union(types.string, types.null)),
    geschaeftsartOptions: types.array(types.union(types.string, types.null)),
    aktenstandortOptions: types.array(types.union(types.string, types.null)),
    interneOptions: types.array(InterneOptions),
    externeOptions: types.array(ExterneOptions),
    filterFields: types.array(FilterFields),
    sortFields: types.array(SortFields),
  })
  .volatile(() => ({
    error: [],
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
  .actions(self => ({
    toggleActivatedById(idGeschaeft) {
      self.activeId =
        self.activeId && self.activeId === idGeschaeft ? null : idGeschaeft
    },
    fetch() {
      const store = getParent(self, 1)
      const { app, addError, history } = store
      self.fetching = true
      let geschaefte = []
      try {
        geschaefte = app.db
          .prepare('SELECT * FROM geschaefte ORDER BY idGeschaeft DESC')
          .all()
      } catch (error) {
        self.fetching = false
        addError(error)
      }
      /**
       * convert date fields
       * from YYYY-MM-DD to DD.MM.YYYY
       */
      geschaefte.forEach(g => {
        const geschaeft = g
        Object.keys(geschaeft).forEach(field => {
          if (isDateField(field)) {
            geschaeft[field] = convertDateToDdMmYyyy(geschaeft[field])
          }
        })
      })
      self.fetching = false
      self.geschaefte = geschaefte
      if (history.location.pathname !== '/geschaefte') {
        history.push('/geschaefte')
      }
    },
  }))
