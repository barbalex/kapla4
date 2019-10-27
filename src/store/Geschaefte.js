import { types, getParent } from 'mobx-state-tree'
import _ from 'lodash'
import moment from 'moment'

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
import geschaefteSortByFieldsGetSortFields from '../src/geschaefteSortByFieldsGetSortFields'

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
    sortByFields(field, direction) {
      const store = getParent(self, 1)
      const { reportType, initiate } = store.pages
      const sortFields = geschaefteSortByFieldsGetSortFields(
        store,
        field,
        direction,
      )
      self.sortFields = sortFields
      /**
       * if pages are active,
       * initiate with new data
       */
      const path = store.history.location.pathname
      if (path === '/pages') {
        initiate(reportType)
      }
    },
    resetSort() {
      self.sortFields = []
    },
    filterByFields(filterFields, filterType = 'nach Feldern') {
      const store = getParent(self, 1)
      const { reportType, initiate } = store.pages
      const { geschaeftePlusFilteredAndSorted } = store.geschaefte
      store.geschaefte.filterFields = filterFields
      store.geschaefte.filterFulltext = ''
      store.geschaefte.filterType = filterType || null
      store.geschaefte.activeId = null
      /**
       * if pages are active,
       * initiate with new data
       */
      const path = store.history.location.pathname
      if (path === '/pages') {
        initiate(reportType)
      } else if (geschaeftePlusFilteredAndSorted.length === 1) {
        self.toggleActivatedById(geschaeftePlusFilteredAndSorted[0].idGeschaeft)
      }
    },
    filterByFulltext(filterFulltext) {
      const store = getParent(self, 1)
      const { geschaefte, history } = store
      const { initiate, reportType } = store.pages
      const { geschaeftePlusFilteredAndSorted } = geschaefte
      self.filterType = 'nach Volltext'
      self.filterFulltext = filterFulltext
      self.filterFields = []
      self.activeId = null
      /**
       * if pages are active,
       * initiate with new data
       */
      const path = history.location.pathname
      if (path === '/pages') {
        initiate(reportType)
      } else {
        if (path !== '/geschaefte') {
          history.push('/geschaefte')
        }
        if (geschaeftePlusFilteredAndSorted.length === 1) {
          self.toggleActivatedById(
            geschaeftePlusFilteredAndSorted[0].idGeschaeft,
          )
        }
      }
    },
    removeFilters() {
      self.GefilterteIds = _.sortBy(self.geschaefte, g => g.idGeschaeft)
        .reverse()
        .map(g => g.idGeschaeft)
      self.filterFields = []
      self.filterType = null
      self.filterFulltext = ''
      self.sortFields = []
    },
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
    fetchGeko() {
      const store = getParent(self, 1)
      const { app, addError } = store
      self.fetching = true
      let geko = []
      try {
        geko = app.db
          .prepare('SELECT * FROM geko ORDER BY idGeschaeft, gekoNr')
          .all()
      } catch (error) {
        self.fetching = false
        addError(error)
      }
      self.fetching = false
      self.geko = geko
    },
    fetchLinks() {
      const store = getParent(self, 1)
      const { app, addError } = store
      self.fetching = true
      let links = []
      try {
        links = app.db
          .prepare('SELECT * FROM links ORDER BY idGeschaeft, url')
          .all()
      } catch (error) {
        self.fetching = false
        return addError(error)
      }
      self.fetching = false
      self.links = links
    },
    geschaeftInsert() {
      const store = getParent(self, 1)
      const { app, history } = store
      const { user } = app
      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      let result
      try {
        result = app.db
          .prepare(
            `
        INSERT INTO
          geschaefte (mutationsdatum, mutationsperson)
        VALUES
          ('${now}', '${user.username}')`,
          )
          .run()
      } catch (error) {
        return self.addError(error)
      }
      const idGeschaeft = result.lastInsertRowid

      // return full dataset
      let geschaeft = {}
      try {
        geschaeft = app.db
          .prepare(
            `
        SELECT
          *
        FROM
          geschaefte
        WHERE
          idGeschaeft = ${idGeschaeft}`,
          )
          .get()
      } catch (error) {
        return self.addError(error)
      }
      self.geschaefte.unshift(geschaeft)
      // need to remove filters
      self.filterFields = []
      self.filterType = null
      self.filterFulltext = ''
      self.sortFields = []
      self.toggleActivatedById(geschaeft.idGeschaeft)
      if (history.location.pathname !== '/geschaefte') {
        history.push('/geschaefte')
      }
    },
    geschaeftDelete(idGeschaeft) {
      const store = getParent(self, 1)
      const {
        app,
        geschaefteKontakteIntern,
        geschaefteKontakteExtern,
        addError,
        geschaeftKontaktInternDelete,
      } = store
      try {
        app.db
          .prepare(
            `
              DELETE FROM
                geschaefte
              WHERE
                idGeschaeft = ${idGeschaeft}`,
          )
          .run()
      } catch (error) {
        console.log('geschaeftDelete error', error)
        return addError(error)
      }
      self.geschaeftRemoveDeleteIntended(idGeschaeft)
      self.geschaefte = self.geschaefte.filter(
        g => g.idGeschaeft !== idGeschaeft,
      )
      // need to delete geschaefteKontakteIntern in self
      const geschaefteKontakteInternToDelete = geschaefteKontakteIntern.geschaefteKontakteIntern.filter(
        g => g.idGeschaeft === idGeschaeft,
      )
      geschaefteKontakteInternToDelete.forEach(g =>
        geschaeftKontaktInternDelete(idGeschaeft, g.idKontakt),
      )
      // need to delete geschaefteKontakteExtern in self
      const geschaefteKontakteExternToDelete = geschaefteKontakteExtern.geschaefteKontakteExtern.filter(
        g => g.idGeschaeft === idGeschaeft,
      )
      geschaefteKontakteExternToDelete.forEach(g =>
        store.geschaeftKontaktExternDelete(idGeschaeft, g.idKontakt),
      )
      // need to delete geKo in self
      const gekoToRemove = self.geko.filter(g => g.idGeschaeft === idGeschaeft)
      gekoToRemove.forEach(g => store.gekoRemove(idGeschaeft, g.gekoNr))
      // need to delete links in self
      const linkselfmove = self.links.filter(l => l.idGeschaeft === idGeschaeft)
      linkselfmove.forEach(l => store.linkDelete(idGeschaeft, l.url))
    },
    geschaeftSetDeleteIntended() {
      self.willDelete = true
    },
    geschaeftRemoveDeleteIntended() {
      self.willDelete = false
    },
  }))
